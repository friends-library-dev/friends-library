import flatten from 'lodash/flatten';
import pLimit from 'p-limit';
import path from 'path';
import fetch from 'node-fetch';
import { FileType, PrintSize, requireEnv } from '@friends-library/types';
import { log, c, red } from '@friends-library/cli/color';
import { cloud, getDocumentMeta } from '@friends-library/client';
import { withCoverServer } from '../publish/cover-server';
import validate, { confirmPrintSize } from './validate';
import { publishPrecursors, prepPublishDir } from '../publish/handler';
import { logDocStart, logDocComplete, logUpdateComplete, logUpdateStart } from './log';
import { getPaperbackCovers } from './paperback-covers';
import { getSourceDocs, SourceDocument } from './source';
import { estimatePrintSize, resizePrintPdf } from './pdf';
import { precursorFromSourceDoc, publishOpts } from './publish';

interface UpdateOptions {
  build: boolean;
  check: boolean;
  pattern?: string;
  useCoverDevServer: boolean;
}

export interface Asset {
  id: string;
  path: string;
  filename: string;
  pdfPages: number;
  printSize: PrintSize;
  type: FileType | 'paperback-cover';
  paperbackCoverBlurb: string;
}

export default async function update(argv: UpdateOptions): Promise<void> {
  logUpdateStart();
  prepPublishDir();
  const sourceDocs = getSourceDocs(argv.pattern);
  const publishAll = makePublishFn(sourceDocs, argv);
  const assets = await withCoverServer(publishAll, argv.useCoverDevServer);
  await updatePageNumbers(assets);
  await uploadAssets(assets);
  argv.build && (await triggerSiteRebuilds());
  logUpdateComplete();
}

function makePublishFn(
  sourceDocs: SourceDocument[],
  argv: UpdateOptions,
): () => Promise<Asset[]> {
  const concurrency = process.env.KITE_UPDATE_CONCURRENCY || 3;
  const limiter = pLimit(Number(concurrency));
  process.setMaxListeners(Math.max(sourceDocs.length * 2, 20));
  return async () => {
    const pool = sourceDocs.map((doc, index) =>
      limiter(async () => await publishDoc(doc, index, sourceDocs.length, argv)),
    );
    return flatten(await Promise.all(pool));
  };
}

async function publishDoc(
  sourceDoc: SourceDocument,
  index: number,
  numDocs: number,
  { check }: UpdateOptions,
): Promise<Asset[]> {
  const assetStart = Date.now();
  const progress = c`{gray (${String(index + 1)}/${String(numDocs)})}`;

  logDocStart(sourceDoc, progress);
  const precursor = precursorFromSourceDoc(sourceDoc);
  let printSize = await estimatePrintSize(sourceDoc.fullPath, precursor.adoc.length);
  const publishOptions = publishOpts(printSize, precursor.adoc.length, check);
  const artifacts = await publishPrecursors([precursor], publishOptions);

  let { sizeCorrect, otherSizes, numPages } = await confirmPrintSize(
    artifacts,
    printSize,
  );

  if (!sizeCorrect) {
    [numPages, printSize] = await resizePrintPdf(
      artifacts,
      precursor,
      publishOptions,
      otherSizes,
    );
  }

  const assets: Asset[] = artifacts.map(artifact => ({
    id: sourceDoc.edition.id(),
    path: artifact.filePath,
    filename: path.basename(artifact.filePath),
    type: <FileType>path.basename(artifact.srcDir),
    printSize,
    pdfPages: numPages,
    paperbackCoverBlurb: sourceDoc.edition.paperbackCoverBlurb(),
  }));

  await validate(assets, precursor);
  const paperbackCovers = await getPaperbackCovers(assets, precursor, sourceDoc);
  logDocComplete(sourceDoc, assetStart, progress);
  return assets.concat(paperbackCovers);
}

async function updatePageNumbers(assets: Asset[]): Promise<void> {
  const meta = await getDocumentMeta();
  assets
    .filter(asset => asset.type === 'pdf-print')
    .forEach(asset => {
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
  } catch (error) {
    red('Error uploading generated assets');
    console.error(error);
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
