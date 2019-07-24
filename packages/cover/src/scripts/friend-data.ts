import '@friends-library/client/load-env';
import { red } from '@friends-library/cli/color';
import * as fs from 'fs';
import { sync as glob } from 'glob';
import { execSync } from 'child_process';
import { getAllFriends, Edition, Friend } from '@friends-library/friends';
import { FriendData } from '../components/Cover/types';
import { PrintSize, requireEnv } from '@friends-library/types';
import { DocumentMeta } from '@friends-library/client';
import { choosePrintSize } from '@friends-library/asciidoc';

const { KITE_DOCS_REPOS_ROOT: ROOT } = requireEnv('KITE_DOCS_REPOS_ROOT');
const meta = new DocumentMeta();

(async () => {
  await meta.load();
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
})();

function mapDocuments(friend: Friend): FriendData['documents'] {
  return friend.documents.map(document => {
    const path = `${ROOT}${document.friend.lang}${document.url()}`;
    let customCss = null;
    let customHtml = null;
    if (fs.existsSync(`${path}/cover.css`)) {
      customCss = fs.readFileSync(`${path}/cover.css`).toString();
    }
    if (fs.existsSync(`${path}/cover.html`)) {
      customHtml = fs.readFileSync(`${path}/cover.html`).toString();
    }
    return {
      title: document.title,
      description: document.description,
      customCss,
      customHtml,
      editions: document.editions.map(edition => {
        const type = friend.lang === 'es' ? 'spanish' : edition.type;
        return {
          id: `${friend.slug}/${document.slug}/${type}`,
          type,
          ...(edition.isbn ? { isbn: edition.isbn } : {}),
          ...estimatePages(edition),
        };
      }),
    };
  });
}

function estimatePages(edition: Edition): { size: PrintSize; pages: number } {
  const { document } = edition;
  const path = `${document.friend.lang}${document.url()}/${edition.type}`;
  if (!fs.existsSync(`${ROOT}/${path}`)) {
    red(`No dir found: ${path}`);
    return {
      size: 'm',
      pages: 222,
    };
  }

  const adocFiles = glob(`${ROOT}/${path}/*.adoc`);
  const adocLength = adocFiles
    .map(filepath => fs.readFileSync(filepath, 'UTF-8'))
    .join('').length;

  const pages = {
    s: meta.estimatePages(adocLength, adocFiles.length, 's'),
    m: meta.estimatePages(adocLength, adocFiles.length, 'm'),
    xl: meta.estimatePages(adocLength, adocFiles.length, 'xl'),
  };

  const size = choosePrintSize(pages);

  return {
    size,
    pages: pages[size],
  };
}
