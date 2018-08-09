// @flow
import fs from 'fs-extra';
import epubCheck from 'epub-check';
import chalk from 'chalk';
import Zip from 'node-zip';
import type { FileManifest, Command } from '../type';


export async function make(
  manifest: FileManifest,
  filename: string,
  { check }: Command,
): Promise<string> {
  const zip = new Zip();
  Object.keys(manifest).forEach(path => {
    zip.file(path, manifest[path]);
    fs.outputFileSync(`_publish/_src_/${filename}/epub/${path}`, manifest[path]);
  });

  const binary = zip.generate({ base64: false, compression: 'DEFLATE' });
  const file = `${filename}.epub`;
  fs.writeFileSync(`_publish/${file}`, binary, 'binary');

  if (check) {
    const result = await epubCheck(`_publish/_src_/${filename}/epub`);
    if (result.pass !== true) {
      console.log(chalk.red(JSON.stringify(simplifyErrors(result.messages), null, 2)));
      console.log(`${chalk.red('Invalid epub created:')} ${chalk.yellow(filename)}`);
      process.exit();
    }
  }

  return file;
}


function simplifyErrors(messages) {
  return messages.map(msg => ({
    location: `${msg.file.replace(/^\.\//, '')}:${msg.line} (${msg.col})`,
    error: `${msg.msg} ${msg.type}`,
  }));
}
