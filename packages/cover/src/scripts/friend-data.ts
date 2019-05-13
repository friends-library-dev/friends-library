import '@friends-library/client/load-env';
import { red } from '@friends-library/cli/color';
import * as fs from 'fs';
import { sync as glob } from 'glob';
import { execSync } from 'child_process';
import { getAllFriends, Edition, Friend } from '@friends-library/friends';
import { FriendData } from '../components/Cover/types';
import { PrintSizeAbbrev, requireEnv } from '@friends-library/types';

const { KITE_DOCS_REPOS_ROOT: ROOT } = requireEnv('KITE_DOCS_REPOS_ROOT');

const data: FriendData[] = Object.values(
  getAllFriends('en')
    .concat(getAllFriends('es'))
    .filter(friend => !['Jane Doe', 'John Doe'].includes(friend.name))
    .reduce(
      (acc, friend: Friend) => {
        if (!acc[friend.name]) {
          acc[friend.name] = {
            name: friend.name,
            description: friend.description,
            documents: [],
          };
        }
        acc[friend.name].documents = acc[friend.name].documents.concat(
          mapDocuments(friend),
        );
        return acc;
      },
      {} as { [k: string]: FriendData },
    ),
);

fs.writeFileSync(
  `${__dirname}/../../public/friends.js`,
  `window.Friends = ${JSON.stringify(data)}`,
);

execSync(
  `cd ${__dirname}/../../ && ../../node_modules/.bin/prettier --write "./public/friends.js"`,
);

function mapDocuments(friend: Friend): FriendData['documents'] {
  return friend.documents.map(document => ({
    title: document.title,
    description: document.description,
    editions: document.editions.map(edition => ({
      type: friend.lang === 'es' ? 'spanish' : edition.type,
      ...(edition.isbn ? { isbn: edition.isbn } : {}),
      ...estimatePages(edition),
    })),
  }));
}

function estimatePages(
  edition: Edition,
): {
  defaultSize: PrintSizeAbbrev;
  pages: Record<PrintSizeAbbrev, number>;
} {
  const { document } = edition;
  const path = `${document.friend.lang}${document.url()}/${edition.type}`;
  if (!fs.existsSync(`${ROOT}/${path}`)) {
    red(`No dir found: ${path}`);
    return {
      defaultSize: 'm',
      pages: {
        s: 111,
        m: 222,
        l: 333,
        xl: 444,
        xxl: 555,
      },
    };
  }

  const adocLength = glob(`${ROOT}/${path}/*.adoc`)
    .map(filepath => fs.readFileSync(filepath, 'UTF-8'))
    .join('').length;

  const pages = {
    s: Math.floor(adocLength * 0.000789195),
    m: Math.floor(adocLength * 0.000492331),
    l: Math.floor(adocLength * 0.000474325),
    xl: Math.floor(adocLength * 0.000419238),
    xxl: Math.floor(adocLength * 0.000307021),
  };

  let defaultSize: PrintSizeAbbrev = 's';
  if (pages.s > 175) defaultSize = 'm';
  if (pages.m > 500) defaultSize = 'xl';

  return {
    defaultSize,
    pages,
  };
}
