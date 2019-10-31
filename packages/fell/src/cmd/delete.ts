import { red } from '@friends-library/cli-utils/color';
import { CommandBuilder } from 'yargs';
import { Argv as BaseArgv } from '../type';
import { getRepos } from '../repos';
import { excludable, scopeable } from './helpers';
import * as git from '../git';

type Argv = BaseArgv & {
  branch: string;
};

export async function handler({ exclude, branch, scope }: Argv): Promise<void> {
  const repos = await getRepos(exclude, scope);
  repos.forEach(async repo => {
    const currentBranch = await git.getCurrentBranch(repo);
    if (currentBranch === branch) {
      red(`Can't delete ${branch} from repo ${repo}, it is checked out.`);
      return;
    }

    const hasBranch = await git.hasBranch(repo, branch);
    if (!hasBranch) {
      return;
    }

    const success = await git.deleteBranch(repo, branch);
    if (!success) {
      red(`Error deleting branch ${branch} from repo: ${repo}`);
    }
  });
}

export const command = 'delete <branch>';

export const describe = 'delete a branch from all selected repos';

export const builder: CommandBuilder = function(yargs) {
  return yargs
    .positional('branch', {
      type: 'string',
      required: true,
    })
    .option('scope', scopeable.scope)
    .option('exclude', excludable.exclude);
};
