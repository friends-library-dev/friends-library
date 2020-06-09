import fs from 'fs-extra';
import path from 'path';
import { green } from '@friends-library/cli-utils/color';
import { Options } from 'yargs';
import { sync as glob } from 'glob';
import { Argv } from '../type';
import { getRepos } from '../repos';
import { excludable } from './helpers';

export async function handler({ exclude }: Argv): Promise<void> {
  const workflowFiles = glob(`${__dirname}/../../../../actions/workflows/*.yml`);
  const workflows = workflowFiles.map(absPath => ({
    basename: path.basename(absPath),
    contents: fs.readFileSync(absPath),
  }));

  const repoPaths = await getRepos(exclude);
  for (const repoPath of repoPaths) {
    const workflowDir = `${repoPath}/.github/workflows`;
    fs.mkdirpSync(workflowDir);
    for (const { basename, contents } of workflows) {
      fs.writeFileSync(`${workflowDir}/${basename}`, contents);
    }
  }

  green(`Synced github action workflow files for ${repoPaths.length} repos`);
}

export const command = `workflows`;

export const describe = `Syncs github action workflow files to all doc repos`;

export const builder: { [key: string]: Options } = excludable;
