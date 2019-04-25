import fs from 'fs';
import { exec } from 'child_process';
import { coverFromProps } from './cover/handler';
import { green } from '@friends-library/cli/color';

export const command = 'cover:watch';

export const describe = 'watch for cover jobs';

export async function handler() {
  const path = `${process.cwd()}/packages/cover/listen/cover.json`;
  green(`watching for jobs at ${path}`);
  while (true) {
    if (fs.existsSync(path)) {
      const props = JSON.parse(fs.readFileSync(path, 'UTF-8'));
      fs.unlinkSync(path);
      const filePath = await coverFromProps(props);
      exec(`open "${filePath}"`);
    }
    await new Promise(res => setTimeout(res, 200));
  }
}
