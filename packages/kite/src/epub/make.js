// @flow
import { resolve } from 'path';
import fs from 'fs-extra';
import epubCheck from 'epub-check';
import chalk from 'chalk';
import Zip from 'node-zip';
import type { FileManifest } from '../type';


export async function make(
  manifest: FileManifest,
  filename: string,
  check: boolean = true
): Promise<*> {
  const zip = new Zip();
  for (let path in manifest) {
    zip.file(path, manifest[path]);
    fs.outputFileSync(`_publish/_src_/${filename}/epub/${path}`, manifest[path]);
  }

  const binary = zip.generate({ base64: false, compression: 'DEFLATE' });
  fs.writeFileSync(`_publish/${filename}.epub`, binary, 'binary');

  if (!check) {
    return;
  }

  const result = await epubCheck(`_publish/_src_/${filename}/epub`);
  if (result.pass !== true) {
    console.log(chalk.red(JSON.stringify(simplifyErrors(result.messages), null, 2)));
    console.log(`${chalk.red('Invalid epub created:')} ${chalk.yellow(filename)}`);
    process.exit();
  }
}


function simplifyErrors(messages) {
  return messages.map(msg => ({
    location: `${msg.file.replace(/^\.\//, '')}:${msg.line} (${msg.col})`,
    error: `${msg.msg} ${msg.type}`,
  }));
}
