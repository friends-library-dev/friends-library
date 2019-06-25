import { sync as glob } from 'glob';
import flatten from 'lodash/flatten';
import pLimit from 'p-limit';
import prettyMilliseconds from 'pretty-ms';
import { requireEnv } from '@friends-library/types';
import { Friend, Document, Edition, getAllFriends } from '@friends-library/friends';
import { buildPrecursor } from '../publish/precursors';
import { withCoverServer } from '../publish/cover-server';
import { publishPrecursors, prepPublishDir } from '../publish/handler';
import { green, yellow } from '@friends-library/cli/color';

interface UpdateOptions {
  pattern?: string;
  useCoverDevServer: boolean;
}

type Target = 'pdf-print' | 'pdf-web' | 'epub' | 'mobi';

interface Asset {
  fullPath: string;
  friend: Friend;
  document: Document;
  edition: Edition;
}

export default async function update(argv: UpdateOptions): Promise<void> {
  prepPublishDir();
  const unfiltered = getAllCandidates(argv.pattern);
  const filtered = filterByPattern(unfiltered, argv.pattern);
  const assets = needingUpdate(filtered);
  const concurrency = process.env.KITE_UPDATE_CONCURRENCY || 3;
  const limiter = pLimit(Number(concurrency));
  const updateStart = Date.now();
  process.setMaxListeners(assets.length);

  let results;
  await withCoverServer(async () => {
    const pool = assets.map(asset =>
      limiter(async () => {
        const assetStart = Date.now();
        const { friend, document, edition } = asset;
        yellow(`Begin generation of assets for ${edition.url()}`);
        const precursor = buildPrecursor(
          friend.lang,
          friend.slug,
          document.slug,
          edition.type,
        );
        const artifacts = await publishPrecursors([precursor], {
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
        });
        green(
          `Completed generation of assets for ${edition.url()} in ${prettyMilliseconds(
            Date.now() - assetStart,
          )} (total: ${prettyMilliseconds(Date.now() - updateStart)})`,
        );
        console.log(artifacts);
      }),
    );
    results = flatten(await Promise.all(pool));
  }, argv.useCoverDevServer);

  console.log(results);
  process.exit();
}

function getAllCandidates(pattern?: string): Asset[] {
  const paths = glob(`${ROOT}/{es,en}/*/*/*/`)
    .filter(path => !pattern || path.indexOf(pattern) !== -1)
    .map(path => path.replace(/\/$/, ''));
  const editions = getEditions();
  return paths.map(path => assetFromPath(path, editions));
}

function assetFromPath(path: string, editions: Map<string, Edition>): Asset {
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

function filterByPattern(assets: Asset[], pattern?: string): Asset[] {
  if (!pattern) return assets;
  return assets.filter(asset => asset.fullPath.indexOf(pattern) !== -1);
}

function needingUpdate(assets: Asset[]): Asset[] {
  return assets.filter(asset => assetChanged(asset) || productionChanged(asset));
}

function assetChanged(asset: Asset): boolean {
  // @TODO implement real logic
  if (asset) return true;
  return true;
}

function productionChanged(asset: Asset): boolean {
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
