import { Options } from 'yargs';
import { green } from '@friends-library/cli-utils/color';
import { Argv } from '../type';
import { getRepos, getStatusGroups } from '../repos';
import { excludable, scopeable } from './helpers';
import * as git from '../git';

export async function handler({ exclude, scope }: Argv): Promise<void> {
  const repos = await getRepos(exclude, scope);
  const { clean } = await getStatusGroups(repos);
  await Promise.all(clean.map(git.sync));
  green(`👍  ${clean.length} repos synced.`);
}

export const command = 'sync';

export const describe = 'like git pull --rebase';

export const builder: { [key: string]: Options } = {
  ...excludable,
  ...scopeable,
};
