import fs from 'fs';
import { CommandBuilder } from 'yargs';
import { execSync } from 'child_process';
import { green, magenta } from '@friends-library/cli/color';
import { coverFromProps } from './cover/handler';

export const command = 'cover:watch';

export const describe = 'watch for cover jobs';

export async function handler({ exec }: { exec: boolean }) {
  const path = `${process.cwd()}/packages/cover/listen/cover.json`;

  if (exec) {
    const props = JSON.parse(fs.readFileSync(path, 'UTF-8'));
    fs.unlinkSync(path);
    const filePath = await coverFromProps(props);
    execSync(`open ${filePath}`);
    return;
  }

  green(`watching for jobs at ${path}`);
  while (true) {
    if (fs.existsSync(path)) {
      magenta('Received job, initiating...');
      execSync(`cd ${process.cwd()} && yarn kite cover:watch --exec`);
    }
    await new Promise(res => setTimeout(res, 200));
  }
}

export const builder: CommandBuilder = function(yargs) {
  return yargs.option('exec', {
    type: 'boolean',
    default: false,
  });
};
