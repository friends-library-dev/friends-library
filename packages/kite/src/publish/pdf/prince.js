// @flow
/* istanbul ignore file */
import fs from 'fs-extra';
import { spawn, exec } from 'child_process';
import { yellow } from '@friends-library/cli/color';
import type { FileManifest } from '../../type';
import { PUBLISH_DIR } from '../file';

export function prince(
  manifest: FileManifest,
  srcDir: string,
  filename: string,
  open: boolean = false,
  outputLineMap: (line: string) => string = l => l,
): Promise<string> {
  if (srcDir.indexOf(`${PUBLISH_DIR}/_src_/`) === 0) {
    throw new Error(`srcDir param must be relative to ${PUBLISH_DIR}/_src_/`);
  }
  const dir = `${PUBLISH_DIR}/_src_/${srcDir}`;
  const writeFiles = Promise.all(Object.keys(manifest).map(path => (
    fs.outputFile(`${dir}/${path}`, manifest[path])
  )));

  return writeFiles
    .then(() => {
      const src = `${dir}/doc.html`;
      const stream = spawn('prince-books', [src]);
      let output = '';

      return new Promise((resolve, reject) => {
        stream.stderr.on('data', data => {
          output = output.concat(data.toString());
        });

        stream.on('close', code => {
          output = output
            .trim()
            .split('\n')
            .filter(filterPrinceOutput)
            .map(outputLineMap)
            .join('\n');

          if (output) {
            yellow(output);
          }

          return code === 0 ? resolve() : reject(new Error(`prince-books error ${code}`));
        });
      });
    })
    .then(() => {
      return fs.move(`${dir}/doc.pdf`, `${PUBLISH_DIR}/${filename}`);
    })
    .then(() => {
      if (open) {
        exec(`open "${PUBLISH_DIR}/${filename}"`);
      }
      return filename;
    });
}


function filterPrinceOutput(line: string): boolean {
  if (line.trim() === '') {
    return false;
  }

  if (line.match(/^prince: warning: cannot fit footnote\(s\) on page/)) {
    return false;
  }

  return true;
}
