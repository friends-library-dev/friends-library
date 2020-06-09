import fs from 'fs';
import { getAllFriends, Friend } from '@friends-library/friends';
import env from '@friends-library/env';

export default async function handler(): Promise<void> {
  const ymls = getYmls();
  console.log(ymls.length);
}

function getYmls(): { friend: Friend; path: string; raw: string; repoPath: string }[] {
  const { DOCS_REPOS_ROOT } = env.require(`DOCS_REPOS_ROOT`);
  const friends = getAllFriends(`en`, true)
    .concat(getAllFriends(`es`, true))
    .filter(friend => friend.name.endsWith(` Doe`) === false);

  return friends.map(friend => {
    const path = `${__dirname}/../../../../friends/yml/${friend.path}.yml`;
    return {
      friend,
      path,
      raw: fs.readFileSync(path).toString(),
      repoPath: `${DOCS_REPOS_ROOT}${friend.path}`,
    };
  });
}
