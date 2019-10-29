import { execSync } from 'child_process';
import memoize from 'lodash/memoize';
import { log, c } from '@friends-library/cli-utils/color';
import * as docMeta from '@friends-library/document-meta';
import { Sha, DocPrecursor, EditionMeta, ArtifactType } from '@friends-library/types';
import * as artifacts from '@friends-library/doc-artifacts';
import * as manifest from '@friends-library/doc-manifests';
import * as cloud from '@friends-library/cloud';
import * as hydrate from '../../fs-precursor/hydrate';
import * as dpcQuery from '../../fs-precursor/query';
import FsDocPrecursor from '../../fs-precursor/FsDocPrecursor';
import * as coverServer from './cover-server';
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
  const COVER_PORT = argv.coverServerPort || (await coverServer.start());
  const [makeScreenshot, closeHeadlessBrowser] = await coverServer.screenshot(COVER_PORT);
  const dpcs = dpcQuery.getByPattern(argv.pattern);

  for (let i = 0; i < dpcs.length; i++) {
    const dpc = dpcs[i];
    const assetStart = Date.now();
    const progress = c`{gray (${String(i + 1)}/${String(dpcs.length)})}`;

    logDocStart(dpc, progress);
    hydrate.all([dpc]);

    const meta = await docMeta.fetch();
    const uploads = new Map<string, string>();
    const fileId = getFileId(dpc);
    const namespace = `fl-publish/${fileId}`;
    const opts = { namespace, srcPath: fileId };
    artifacts.deleteNamespaceDir(namespace);

    await handleEbooks(dpc, opts, uploads, makeScreenshot);
    await handlePaperbackAndCover(dpc, opts, uploads, meta);
    const urls = await cloud.uploadFiles(uploads);
    console.log(urls);
    await docMeta.save(meta);

    logDocComplete(dpc, assetStart, progress);
  }

  if (!argv.coverServerPort) coverServer.stop(COVER_PORT);
  await closeHeadlessBrowser();
}

async function handlePaperbackAndCover(
  dpc: FsDocPrecursor,
  opts: { namespace: string; srcPath: string },
  uploads: Map<string, string>,
  meta: docMeta.DocumentMeta,
): Promise<void> {
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

  const coverManifests = await manifest.cover(dpc, {
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
  const [epubManifest] = await manifest.epub(dpc, { ...config, subType: 'epub' });
  const [mobiManifest] = await manifest.mobi(dpc, { ...config, subType: 'mobi' });
  const epub = await artifacts.create(epubManifest, base, { ...opts, check: true });
  const mobi = await artifacts.create(mobiManifest, base, { ...opts, check: false });
  uploads.set(epub, cloudPath(dpc, 'epub'));
  uploads.set(mobi, cloudPath(dpc, 'mobi'));
}

function cloudPath(dpc: FsDocPrecursor, type: ArtifactType, volNum?: number): string {
  return `${dpc.path}/${dpc.edition!.filename(type, volNum)}`;
}

/*
DONT WORRY ABOUT SPEED, JUST MAKE AS SIMPLE AS POSSIBLE, OPTMIZE LATER
----------------------------------------------------------------------

√ store current production git hash
√ Get all DPCs
X Filter out the ones that we know ahead of time don't need updating // PUNT FOR NOW
√ start up the cover website for screenshots

For each DPC:

  √ make one ebook screenshot for use later
  √ make all {single-vol} print sizes
  √ if necessary, make all multi-vol sizes
  √ pick best print size
  - update meta & persist

  ? rename the chosen pdf file/s
  ? delete unused pdf files

  √ make manifests for:
    √ cover/s (based on chosen pdf/s)
    √ epub (pass ebook screenshot)
    √ mobi (pass ebook screenshot)
  
  - upload the files

/ For each DPC

possibly trigger site rebuild
close the cover website
log end

*/

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
