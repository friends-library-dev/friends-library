// @flow
import { getFriendRepos } from '@friends-library/gui/src/lib/friend-repos';
import { green, magenta } from '@friends-library/cli/color';
import fs from 'fs-extra';
import { cmd } from '.';

export async function gitClone(): Promise<void> {
  let alreadyCloned = 0;
  const cwd = process.cwd();
  const repos = await getFriendRepos();
  repos.forEach(repo => {
    const slug = repo.name;
    if (!fs.pathExistsSync(`${cwd}/en/${slug}`)) {
      green(`📡  Cloning missing repo "/en/${slug}"`);
      cmd(`git clone ${repo.ssh_url}`, `${cwd}/en`);
    } else {
      alreadyCloned++;
    }
  });
  magenta(`👌  Skipped ${alreadyCloned} repos already cloned.`);
}
