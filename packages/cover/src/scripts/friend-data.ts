import '@friends-library/client/load-env';
import { red } from '@friends-library/cli/color';
import * as fs from 'fs';
import { sync as glob } from 'glob';
import { execSync } from 'child_process';
import { getAllFriends, Edition } from '@friends-library/friends';
import { FriendData } from '../components/Cover/types';
import { PrintSizeAbbrev, requireEnv } from '@friends-library/types';

const { KITE_DOCS_REPOS_ROOT: ROOT } = requireEnv('KITE_DOCS_REPOS_ROOT');

const data: FriendData[] = [];

getAllFriends()
  .filter(friend => !['Jane Doe', 'John Doe'].includes(friend.name))
  .forEach(friend => {
    data.push({
      name: friend.name,
      description: friend.description,
      documents: friend.documents.map(document => ({
        title: document.title,
        description: document.description,
        editions: document.editions.map(edition => ({
          type: friend.lang === 'es' ? 'spanish' : edition.type,
          ...estimatePages(edition),
        })),
      })),
    });
  });

fs.writeFileSync(
  `${__dirname}/../../public/friends.js`,
  `window.Friends = ${JSON.stringify(data)}`,
);

execSync(`cd ${__dirname}/../../ && yarn prettier --write "./public/friends.js"`);

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

// a * ? = p
// ? = p / a

// william savery (orig) : 714877
// s: 575 / 714877 = .000804334
// m: 357 / 714877 = .000499387
// l: 345 / 714877 = .000482601
// xl: 305 / 714877 = .000426647
// xxl: 224 / 714877 = .000313341

// g. f. (orig) : 2600586
// s: 2013 / 2600586 = .000774056
// m: 1262 / 2600586 = .000485275
// l: 1212 / 2600586 = .000466049
// xl: 1071 / 2600586 = .00041183
// xxl: 782 / 2600586 = .000300701

// averages:
// (.000313341 + 0.000300701) / 2
