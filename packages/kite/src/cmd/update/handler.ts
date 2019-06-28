import { sync as glob } from 'glob';
import flatten from 'lodash/flatten';
import pLimit from 'p-limit';
import path from 'path';
import prettyMilliseconds from 'pretty-ms';
import {
  requireEnv,
  SourcePrecursor,
  DocumentArtifacts,
  FileType,
  Lang,
  Slug,
  EditionType,
} from '@friends-library/types';
import { green, yellow } from '@friends-library/cli/color';
import { Friend, Document, Edition, getAllFriends } from '@friends-library/friends';
import { buildPrecursor } from '../publish/precursors';
import { withCoverServer } from '../publish/cover-server';
import validate from './validate';
import {
  publishPrecursors,
  prepPublishDir,
  PublishPrecursorOpts,
} from '../publish/handler';

interface UpdateOptions {
  pattern?: string;
  useCoverDevServer: boolean;
}

interface SourceDocument {
  fullPath: string;
  friend: Friend;
  document: Document;
  edition: Edition;
}

export interface Asset {
  path: string;
  filename: string;
  pdfPages?: number;
  target: FileType;
  lang: Lang;
  friendSlug: Slug;
  documentSlug: Slug;
  editionType: EditionType;
}

export default async function update(argv: UpdateOptions): Promise<void> {
  prepPublishDir();
  const unfiltered = getAllCandidates(argv.pattern);
  const filtered = filterByPattern(unfiltered, argv.pattern);
  const sourceDocs = needingUpdate(filtered);
  const concurrency = process.env.KITE_UPDATE_CONCURRENCY || 3;
  const limiter = pLimit(Number(concurrency));
  const updateStart = Date.now();
  process.setMaxListeners(Math.max(sourceDocs.length * 2, 20));

  let results: Asset[] = [];
  await withCoverServer(async () => {
    const pool = sourceDocs.map(doc =>
      limiter(async () => {
        const assetStart = Date.now();
        const precursor = precursorFromAsset(doc);
        const artifacts = await publishPrecursors([precursor], publishOpts());
        logGeneration(doc, assetStart, updateStart);
        const assetsWithoutPages = artifacts.map(artifact => asset(artifact, doc));
        const assetsWithPages = await validate(assetsWithoutPages, precursor);
        return assetsWithPages;
      }),
    );
    results = flatten(await Promise.all(pool));
  }, argv.useCoverDevServer);
  console.log(results);
}

function asset(
  { filePath, srcDir }: DocumentArtifacts,
  { friend, document, edition }: SourceDocument,
): Asset {
  return {
    path: filePath,
    filename: path.basename(filePath),
    target: <FileType>path.basename(srcDir),
    lang: friend.lang,
    friendSlug: friend.slug,
    documentSlug: document.slug,
    editionType: edition.type,
  };
}

function precursorFromAsset(asset: SourceDocument): SourcePrecursor {
  const { friend, document, edition } = asset;
  yellow(`Begin generation of assets for ${edition.url()}`);
  return buildPrecursor(friend.lang, friend.slug, document.slug, edition.type);
}

function elapsed(timestamp: number): string {
  return prettyMilliseconds(Date.now() - timestamp);
}

function logGeneration(
  asset: SourceDocument,
  assetStart: number,
  updateStart: number,
): void {
  const timing = `${elapsed(assetStart)} (total: ${elapsed(updateStart)})`;
  green(`Completed generation of assets for \`${asset.edition.url()}\` in ${timing}`);
}

function publishOpts(): PublishPrecursorOpts {
  return {
    perform: true,
    check: true,
    noFrontmatter: false,
    condense: false, // @TODO
    createEbookCover: true,
    printSize: 'm', // @TODO
    open: false,
    email: '',
    send: false,
    target: ['pdf-print', 'pdf-web', 'epub', 'mobi'],
  };
}

function getAllCandidates(pattern?: string): SourceDocument[] {
  const paths = glob(`${ROOT}/{es,en}/*/*/*/`)
    .filter(path => !pattern || path.indexOf(pattern) !== -1)
    .map(path => path.replace(/\/$/, ''));
  const editions = getEditions();
  return paths.map(path => assetFromPath(path, editions));
}

function assetFromPath(path: string, editions: Map<string, Edition>): SourceDocument {
  const relPath = path.replace(new RegExp(`^${ROOT}`), '');
  const edition = editions.get(relPath);
  if (!edition) throw new Error(`Unable to find entities from path: ${path}`);
  const document = edition.document;
  const friend = document.friend;
  return {
    fullPath: path,
    friend,
    document,
    edition,
  };
}

function filterByPattern(assets: SourceDocument[], pattern?: string): SourceDocument[] {
  if (!pattern) return assets;
  return assets.filter(asset => asset.fullPath.indexOf(pattern) !== -1);
}

function needingUpdate(assets: SourceDocument[]): SourceDocument[] {
  return assets.filter(asset => assetChanged(asset) || productionChanged(asset));
}

function assetChanged(asset: SourceDocument): boolean {
  // @TODO implement real logic
  if (asset) return true;
  return true;
}

function productionChanged(asset: SourceDocument): boolean {
  // @TODO implement real logic
  if (asset) return true;
  return true;
}

function getEditions(): Map<string, Edition> {
  const editions = new Map<string, Edition>();
  [...getAllFriends('en'), ...getAllFriends('es')].forEach(friend => {
    friend.documents.forEach(document => {
      document.editions.forEach(edition => {
        const path = `${friend.lang}/${friend.slug}/${document.slug}/${edition.type}`;
        editions.set(path, edition);
      });
    });
  });
  return editions;
}

const { KITE_DOCS_REPOS_ROOT: ROOT } = requireEnv('KITE_DOCS_REPOS_ROOT');
