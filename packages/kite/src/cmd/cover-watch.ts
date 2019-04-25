import fs from 'fs';
import decache from 'decache';
import { exec } from 'child_process';
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

      // clear the module cache and re-require so we get the latest
      // changes from the kite/cmd/cover/* AND cover/* while watching
      decache('./cover/handler');
      const { coverFromProps } = require('./cover/handler');

      const filePath = await coverFromProps(props);
      exec(`open "${filePath}"`);
    }
    await new Promise(res => setTimeout(res, 200));
  }
}
