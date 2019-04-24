import { green } from '@friends-library/cli/color';
import { Options } from 'yargs';
import { Argv as BaseArgv } from '../type';
import { getRepos, getStatusGroups } from '../repos';
import { excludable, scopeable } from './helpers';
import * as git from '../git';

type Argv = BaseArgv & {
  createBranch: boolean;
  branchName: string;
};

export async function handler({
  exclude,
  scope,
  createBranch,
  branchName: branch,
}: Argv): Promise<void> {
  const repos = await getRepos(exclude, scope);
  const { clean } = await getStatusGroups(repos);
  const exists = await Promise.all(clean.map(repo => git.hasBranch(repo, branch)));

  if (!createBranch) {
    if (!exists.every(Boolean)) {
      throw new Error(`Can't checkout ${branch}, doesn't exist on every repo.`);
    }

    await Promise.all(clean.map(repo => git.checkoutBranch(repo, branch)));
    green(`${clean.length} branches checked out branch: ${branch}`);
    return;
  }

  if (exists.some(Boolean)) {
    throw new Error(`Can't create ${branch}, exists on at least one repo.`);
  }

  await Promise.all(clean.map(repo => git.checkoutNewBranch(repo, branch)));
  green(`${clean.length} branches checked out new branch: ${branch}`);
}

export const command = 'checkout <branchName>';

export const describe = 'Checkout a branch for all repos';

export const builder: { [key: string]: Options } = {
  ...excludable,
  ...scopeable,
  branchName: {
    type: 'string' as const,
    required: true,
  },
  createBranch: {
    alias: 'b',
    default: false,
    type: 'boolean' as const,
  },
};
