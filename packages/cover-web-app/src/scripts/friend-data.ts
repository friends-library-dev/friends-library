import '@friends-library/env/load';
import * as fs from 'fs';
import { execSync } from 'child_process';
import env from '@friends-library/env';
import { red } from '@friends-library/cli-utils/color';
import { getAllFriends, Friend } from '@friends-library/friends';
import { fetchSingleton, DocumentMeta } from '@friends-library/document-meta';
import { FriendData } from '../types';

const { DOCS_REPOS_ROOT: ROOT } = env.require(`DOCS_REPOS_ROOT`);

(async () => {
  const meta = await fetchSingleton();
  const data: FriendData[] = Object.values(
    getAllFriends(`en`, true)
      .concat(getAllFriends(`es`, true))
      .filter((friend) => ![`Jane Doe`, `John Doe`].includes(friend.name))
      .filter((friend) => friend.hasNonDraftDocument)
      .reduce((acc, friend: Friend) => {
        if (!acc[friend.name]) {
          acc[friend.name] = {
            name: friend.name,
            description: friend.description,
            documents: [],
          };
        }
        acc[friend.name].documents = acc[friend.name].documents.concat(
          mapDocuments(friend, meta),
        );
        return acc;
      }, {} as { [k: string]: FriendData }),
  );

  fs.writeFileSync(
    `${__dirname}/../../public/friends.js`,
    `window.Friends = ${JSON.stringify(data)}`,
  );

  execSync(
    `cd ${__dirname}/../../ && ../../node_modules/.bin/prettier --write "./public/friends.js"`,
  );
})();

function mapDocuments(friend: Friend, meta: DocumentMeta): FriendData['documents'] {
  const documents = friend.documents.filter((doc) => doc.hasNonDraftEdition);
  return documents.map((document) => {
    const path = `${friend.lang}/${friend.slug}/${document.slug}`;
    const fullPath = `${ROOT}${path}`;
    let customCss = null;
    let customHtml = null;

    if (fs.existsSync(`${fullPath}/paperback-cover.css`)) {
      customCss = fs.readFileSync(`${fullPath}/paperback-cover.css`).toString();
    }

    if (fs.existsSync(`${fullPath}/paperback-cover.html`)) {
      customHtml = fs.readFileSync(`${fullPath}/paperback-cover.html`).toString();
    }

    return {
      lang: friend.lang,
      title: document.title,
      description: document.description,
      isCompilation: document.isCompilation,
      customCss,
      customHtml,
      editions: document.editions
        .filter((e) => !e.isDraft)
        .map((edition) => {
          const editionMeta = meta.get(`${path}/${edition.type}`);
          if (!editionMeta) red(`No edition meta found for ${edition.path}`);
          return {
            id: `${friend.lang}/${friend.slug}/${document.slug}/${edition.type}`,
            type: edition.type,
            isbn: edition.isbn,
            ...(editionMeta
              ? {
                  size: editionMeta.paperback.size,
                  pages: editionMeta.paperback.volumes[0],
                }
              : { pages: 222, size: `m` }),
          };
        }),
    };
  });
}
