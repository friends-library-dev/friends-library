import { Options } from 'yargs';
import { green } from '@friends-library/cli-utils/color';
import { Argv as BaseArgv } from '../type';
import { getRepos, getStatusGroups } from '../repos';
import { excludable, scopeable } from './helpers';
import * as git from '../git';

type Argv = BaseArgv & {
  message: string;
};

export async function handler({ exclude, scope, message }: Argv): Promise<void> {
  const repos = await getRepos(exclude, scope);
  const { dirty } = await getStatusGroups(repos);
  await Promise.all(dirty.map(repo => git.commitAll(repo, message)));
  green(`${dirty.length} repos added new commit "${message}"`);
}

export const command = `commit`;

export const describe = `commit to all repos`;

export const builder: { [key: string]: Options } = {
  ...excludable,
  ...scopeable,
  message: {
    alias: `m`,
    required: true,
    type: `string` as const,
  },
};
