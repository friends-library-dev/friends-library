import fs from 'fs-extra';
import { Options } from 'yargs';
import { green, magenta } from '@friends-library/cli-utils/color';
import { excludable, scopeable } from './helpers';
import { getFriendRepos } from '../github';
import * as git from '../git';

export async function handler(): Promise<void> {
  let alreadyCloned = 0;
  const cwd = process.cwd();
  const repos = await getFriendRepos();
  await Promise.all(
    repos.map(repo => {
      const slug = repo.name;
      const lang = repo.full_name.startsWith('friends-library/') ? 'en' : 'es';
      const repoPath = `${cwd}/${lang}/${slug}`;
      if (fs.pathExistsSync(repoPath)) {
        alreadyCloned++;
        return Promise.resolve(undefined);
      }
      green(`📡  Cloning missing repo "/${lang}/${slug}"`);
      const url =
        process.env.GITHUB_ACTIONS || process.env.NETLIFY ? repo.clone_url : repo.ssh_url;
      return git.clone(repoPath, url);
    }),
  );
  magenta(`👌  Skipped ${alreadyCloned} repos already cloned.`);
}

export const command = 'clone';

export const describe = 'Clones down all doc repos';

export const builder: { [key: string]: Options } = {
  ...excludable,
  ...scopeable,
};
