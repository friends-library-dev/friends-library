import flatten from 'lodash/flatten';
import pLimit from 'p-limit';
import path from 'path';
import fetch from 'node-fetch';
import {
  DocumentArtifacts,
  FileType,
  Lang,
  Slug,
  EditionType,
  PrintSize,
  requireEnv,
} from '@friends-library/types';
import { log, c, red } from '@friends-library/cli/color';
import { cloud, DocumentMeta } from '@friends-library/client';
import { Friend, Document, Edition } from '@friends-library/friends';
import { withCoverServer } from '../publish/cover-server';
import validate from './validate';
import {
  publishPrecursors as publish,
  prepPublishDir,
  PublishPrecursorOpts,
} from '../publish/handler';
import { filterByPattern, needingUpdate } from './filters';
import { logDocStart, logDocComplete, logUpdateComplete } from './log';
import { getPaperbackCovers } from './paperback-covers';
import { getAllSourceDocs } from './source';
import { precursorFromSourceDoc, publishOpts } from './publish';

interface UpdateOptions {
  pattern?: string;
  useCoverDevServer: boolean;
  build: boolean;
}

export interface SourceDocument {
  fullPath: string;
  friend: Friend;
  document: Document;
  edition: Edition;
}

export type AssetType = FileType | 'paperback-cover';

export interface Asset {
  id: string;
  path: string;
  filename: string;
  pdfPages?: number;
  printSize: PrintSize;
  type: AssetType;
  lang: Lang;
  friendSlug: Slug;
  documentSlug: Slug;
  editionType: EditionType;
  paperbackCoverBlurb: string;
}

export default async function update(argv: UpdateOptions): Promise<void> {
  log(c`\n{cyan Beginning asset updates at} {magenta ${new Date().toLocaleString()}}`);

  prepPublishDir();
  const updateStart = Date.now();
  const unfiltered = getAllSourceDocs(argv.pattern);
  const filtered = filterByPattern(unfiltered, argv.pattern);
  const sourceDocs = needingUpdate(filtered);
  const concurrency = process.env.KITE_UPDATE_CONCURRENCY || 3;
  const limiter = pLimit(Number(concurrency));
  process.setMaxListeners(Math.max(sourceDocs.length * 2, 20));

  const assets = await withCoverServer(async () => {
    const pool = sourceDocs.map((doc, index) =>
      limiter(async () => await processDoc(doc, updateStart, index, sourceDocs.length)),
    );
    return flatten(await Promise.all(pool));
  }, argv.useCoverDevServer);

  await updatePageNumbers(assets);
  await uploadAssets(assets);
  argv.build && (await triggerSiteRebuilds());
  logUpdateComplete(updateStart);
}

async function processDoc(
  doc: SourceDocument,
  updateStart: number,
  index: number,
  numDocs: number,
): Promise<Asset[]> {
  const progress = c`{gray (${String(index + 1)}/${String(numDocs)})}`;
  const assetStart = Date.now();
  logDocStart(doc, progress);
  const precursor = precursorFromSourceDoc(doc);
  const opts = await publishOpts(doc, precursor);
  const artifacts = await publish([precursor], opts);
  const assetsSansPages = artifacts.map(artifact => asset(artifact, doc, opts));
  const assetsWithPages = await validate(assetsSansPages, precursor);
  const paperbackCovers = await getPaperbackCovers(assetsWithPages, precursor, doc);
  logDocComplete(doc, assetStart, updateStart, progress);
  return assetsWithPages.concat(paperbackCovers);
}

function asset(
  { filePath, srcDir }: DocumentArtifacts,
  { friend, document, edition }: SourceDocument,
  { printSize }: PublishPrecursorOpts,
): Asset {
  if (!printSize) throw new Error('Missing print size');
  return {
    id: `${friend.lang}${edition.url()}`,
    path: filePath,
    filename: path.basename(filePath),
    type: <FileType>path.basename(srcDir),
    printSize,
    lang: friend.lang,
    friendSlug: friend.slug,
    documentSlug: document.slug,
    editionType: edition.type,
    paperbackCoverBlurb: edition.paperbackCoverBlurb(),
  };
}

async function updatePageNumbers(assets: Asset[]): Promise<void> {
  const meta = await getMeta();
  assets.forEach(asset => {
    if (asset.type !== 'pdf-print' || typeof asset.pdfPages !== 'number') {
      return;
    }

    const path = `pages.${asset.printSize}`;
    meta.setIn(asset.id, path, asset.pdfPages);
    meta.setIn(asset.id, 'printSize', asset.printSize);
  });

  if (!(await meta.persist())) {
    red('Error persisting updated page numbers');
    process.exit(1);
  }

  log(c`\n{green √} Persisted generated asset page numbers and print sizes`);
}

async function uploadAssets(assets: Asset[]): Promise<void> {
  const map = assets.reduce((map, asset) => {
    map.set(`${asset.id}/${path.basename(asset.path)}`, asset.path);
    return map;
  }, new Map<string, string>());

  try {
    await cloud.uploadFiles(map);
    log(c`{green √} Uploaded ${map.size.toString()} files to cloud storage`);
  } catch {
    red('Error uploading generated assets');
    process.exit(1);
  }
}

async function triggerSiteRebuilds(): Promise<void> {
  const { KITE_UPDATE_EN_BUILD_HOOK_URI, KITE_UPDATE_ES_BUILD_HOOK_URI } = requireEnv(
    'KITE_UPDATE_EN_BUILD_HOOK_URI',
    'KITE_UPDATE_ES_BUILD_HOOK_URI',
  );
  const opts = { method: 'POST', body: '{}' };
  try {
    await Promise.all([
      fetch(KITE_UPDATE_EN_BUILD_HOOK_URI, opts),
      fetch(KITE_UPDATE_ES_BUILD_HOOK_URI, opts),
    ]);
    log(c`{green √} Triggered site re-builds for English and Spanish`);
  } catch (error) {
    red('Error triggering site deploy');
    console.error(error);
    process.exit(1);
  }
}

let meta: DocumentMeta | undefined;

export async function getMeta(): Promise<DocumentMeta> {
  if (!meta) {
    meta = new DocumentMeta();
    await meta.load();
  }
  return meta;
}
