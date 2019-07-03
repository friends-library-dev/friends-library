import flatten from 'lodash/flatten';
import pLimit from 'p-limit';
import path from 'path';
import {
  DocumentArtifacts,
  FileType,
  Lang,
  Slug,
  EditionType,
  PrintSize,
} from '@friends-library/types';
import { log, c } from '@friends-library/cli/color';
import { Friend, Document, Edition } from '@friends-library/friends';
import { withCoverServer } from '../publish/cover-server';
import validate from './validate';
import {
  publishPrecursors as publish,
  prepPublishDir,
  PublishPrecursorOpts,
} from '../publish/handler';
import { filterByPattern, needingUpdate } from './filters';
import { logStart, logComplete } from './log';
import { getPaperbackCovers } from './paperback-covers';
import { getAllSourceDocs } from './source';
import { precursorFromSourceDoc, publishOpts } from './publish';

interface UpdateOptions {
  pattern?: string;
  useCoverDevServer: boolean;
}

export interface SourceDocument {
  fullPath: string;
  friend: Friend;
  document: Document;
  edition: Edition;
}

export type AssetType = FileType | 'paperback-cover';

export interface Asset {
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

  let results: Asset[] = [];
  await withCoverServer(async () => {
    const pool = sourceDocs.map(doc =>
      limiter(async () => {
        const assetStart = Date.now();
        logStart(doc);
        const precursor = precursorFromSourceDoc(doc);
        const opts = await publishOpts(doc, precursor);
        const artifacts = await publish([precursor], opts);
        logComplete(doc, assetStart, updateStart);
        const assetsSansPages = artifacts.map(artifact => asset(artifact, doc, opts));
        const assetsWithPages = await validate(assetsSansPages, precursor);
        const paperbackCovers = await getPaperbackCovers(assetsWithPages, precursor, doc);
        return assetsWithPages.concat(paperbackCovers);
      }),
    );
    results = flatten(await Promise.all(pool));
  }, argv.useCoverDevServer);

  log(results);
}

function asset(
  { filePath, srcDir }: DocumentArtifacts,
  { friend, document, edition }: SourceDocument,
  { printSize }: PublishPrecursorOpts,
): Asset {
  if (!printSize) throw new Error('Missing print size');
  return {
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
