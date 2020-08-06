import fs from 'fs-extra';
import { spawn } from 'child_process';
import { FileManifest } from '@friends-library/types';
import env from '@friends-library/env';
import { EbookOptions } from './types';
import { writeEbookManifest } from './ebook';
import { red } from '@friends-library/cli-utils/color';

export default async function mobi(
  manifest: FileManifest,
  filenameNoExt: string,
  opts: EbookOptions,
): Promise<string> {
  const filePath = await writeEbookManifest(manifest, filenameNoExt, opts, `mobi`);

  try {
    await kindlegen(filePath, filenameNoExt);
  } catch (err) {
    red(`Error generating MOBI ${filenameNoExt}:`);
    red(err);
    process.exit(1);
  }

  return filePath.replace(/\.epub$/, ``);
}

function kindlegen(precursorPath: string, filenameNoExt: string): Promise<void> {
  const { KINDLEGEN_BIN } = env.require(`KINDLEGEN_BIN`);
  const stream = spawn(KINDLEGEN_BIN, [
    precursorPath,
    `-verbose`,
    `-o`,
    `${filenameNoExt}.mobi`,
  ]);

  return new Promise((resolve, reject) => {
    let errors: string[] = [];
    stream.stdout.on(`data`, data => {
      const lines: string[] = data.toString().split(`\n`);
      errors = errors.concat(lines.filter(l => l.match(/^Error/)));
    });

    stream.on(`close`, code => {
      if ([0, 1, 2].includes(code) === false || errors.length) {
        const errorsString = errors.length ? `\n${errors.join(`\n`)}` : ``;
        reject(new Error(`kindlegen returned code ${code}${errorsString}`));
        return;
      }

      fs.remove(precursorPath);
      resolve();
    });
  });
}
