import { execSync } from 'child_process';
import fetch from 'node-fetch';
import memoize from 'lodash/memoize';
import { log, c, red } from '@friends-library/cli-utils/color';
import * as docMeta from '@friends-library/document-meta';
import env from '@friends-library/env';
import { Sha, DocPrecursor, ArtifactType } from '@friends-library/types';
import * as artifacts from '@friends-library/doc-artifacts';
import * as manifest from '@friends-library/doc-manifests';
import * as cloud from '@friends-library/cloud';
import * as hydrate from '../../fs-precursor/hydrate';
import * as dpcQuery from '../../fs-precursor/query';
import FsDocPrecursor from '../../fs-precursor/FsDocPrecursor';
import * as coverServer from './cover-server';
import validate from './validate';
import { logDocStart, logDocComplete, logUpdateComplete, logUpdateStart } from './log';
import { publishPaperback } from './paperback';

interface UpdateOptions {
  build: boolean;
  check: boolean;
  pattern?: string;
  coverServerPort?: number;
}

export default async function update(argv: UpdateOptions): Promise<void> {
  logUpdateStart();
  const meta = await docMeta.fetch();
  const COVER_PORT = argv.coverServerPort || (await coverServer.start());
  const [makeScreenshot, closeHeadlessBrowser] = await coverServer.screenshot(COVER_PORT);
  const dpcs = dpcQuery.getByPattern(argv.pattern);

  for (let i = 0; i < dpcs.length; i++) {
    const dpc = dpcs[i];
    const assetStart = Date.now();
    const progress = c`{gray (${String(i + 1)}/${String(dpcs.length)})}`;

    logDocStart(dpc, progress);
    hydrate.all([dpc]);
    validate(dpc);

    const uploads = new Map<string, string>();
    const fileId = getFileId(dpc);
    const namespace = `fl-publish/${fileId}`;
    const opts = { namespace, srcPath: fileId };
    artifacts.deleteNamespaceDir(namespace);

    await handlePaperbackAndCover(dpc, opts, uploads, meta);
    await handleWebPdf(dpc, opts, uploads);
    await handleEbooks(dpc, opts, uploads, makeScreenshot);
    log(c`   {gray Uploading generated files to cloud storage...}`);
    await cloud.uploadFiles(uploads);
    log(c`   {gray Saving edition meta...}`);
    await docMeta.save(meta);

    logDocComplete(dpc, assetStart, progress);
    argv.build && (await triggerSiteRebuilds());
  }

  if (!argv.coverServerPort) coverServer.stop(COVER_PORT);
  await closeHeadlessBrowser();
}

async function handleWebPdf(
  dpc: FsDocPrecursor,
  opts: { namespace: string; srcPath: string },
  uploads: Map<string, string>,
): Promise<void> {
  log(c`   {gray Creating web-pdf artifact...}`);
  const [webManifest] = await manifest.webPdf(dpc);
  const filename = dpc.edition!.filename('web-pdf');
  const path = await artifacts.pdf(webManifest, filename, opts);
  uploads.set(path, cloudPath(dpc, 'web-pdf'));
}

async function handlePaperbackAndCover(
  dpc: FsDocPrecursor,
  opts: { namespace: string; srcPath: string },
  uploads: Map<string, string>,
  meta: docMeta.DocumentMeta,
): Promise<void> {
  log(c`   {gray Starting paperback interior generation...}`);
  const [paperbackMeta, volumePaths] = await publishPaperback(dpc, opts);
  volumePaths.forEach((path, idx) => {
    const fauxVolNum = volumePaths.length > 1 ? idx + 1 : undefined;
    uploads.set(path, cloudPath(dpc, 'paperback-interior', fauxVolNum));
  });

  meta.set(dpc.path, {
    updated: new Date().toISOString(),
    adocLength: dpc.asciidoc.length,
    numSections: dpc.sections.length,
    revision: dpc.revision.sha,
    productionRevision: getProductionRevision(),
    paperback: paperbackMeta,
  });

  const coverManifests = await manifest.paperbackCover(dpc, {
    printSize: paperbackMeta.size,
    volumes: paperbackMeta.volumes,
  });

  for (let idx = 0; idx < coverManifests.length; idx++) {
    const manifest = coverManifests[idx];
    const fauxVolumeNumber = coverManifests.length > 1 ? idx + 1 : undefined;
    const filename = dpc.edition!.filename('paperback-cover', fauxVolumeNumber);
    const path = await artifacts.pdf(manifest, filename, opts);
    uploads.set(path, cloudPath(dpc, 'paperback-cover', fauxVolumeNumber));
  }
}

async function handleEbooks(
  dpc: FsDocPrecursor,
  opts: { namespace: string; srcPath: string },
  uploads: Map<string, string>,
  makeScreenshot: (id: string) => Promise<Buffer>,
): Promise<void> {
  const coverImg = await makeScreenshot(dpc.path);
  const config = { coverImg, frontmatter: true };
  const base = dpc.edition!.filename('epub').replace(/\..*$/, '');

  log(c`   {gray Creating epub artifact...}`);
  const [epubManifest] = await manifest.epub(dpc, { ...config, subType: 'epub' });
  const epub = await artifacts.create(epubManifest, base, { ...opts, check: true });

  log(c`   {gray Creating mobi artifact...}`);
  const [mobiManifest] = await manifest.mobi(dpc, { ...config, subType: 'mobi' });
  const mobi = await artifacts.create(mobiManifest, base, { ...opts, check: false });

  uploads.set(epub, cloudPath(dpc, 'epub'));
  uploads.set(mobi, cloudPath(dpc, 'mobi'));
}

function cloudPath(dpc: FsDocPrecursor, type: ArtifactType, volNum?: number): string {
  return `${dpc.path}/${dpc.edition!.filename(type, volNum)}`;
}

async function triggerSiteRebuilds(): Promise<void> {
  const { EN_BUILD_HOOK_URI, ES_BUILD_HOOK_URI } = env.require(
    'EN_BUILD_HOOK_URI',
    'ES_BUILD_HOOK_URI',
  );
  const opts = { method: 'POST', body: '{}' };
  try {
    await Promise.all([fetch(EN_BUILD_HOOK_URI, opts), fetch(ES_BUILD_HOOK_URI, opts)]);
    log(c`{green √} Triggered site re-builds for English and Spanish`);
  } catch (error) {
    red('Error triggering site deploy');
    console.error(error);
    process.exit(1);
  }
}

function getFileId(dpc: DocPrecursor): string {
  return [
    dpc.friendInitials.join(''),
    dpc.documentSlug,
    dpc.editionType,
    dpc.documentId.substring(0, 8),
  ].join('--');
}

const getProductionRevision: () => Sha = memoize(() => {
  const cmd = 'git log --max-count=1 --pretty="%h" -- .';
  return execSync(cmd, { cwd: process.cwd() })
    .toString()
    .trim();
});
