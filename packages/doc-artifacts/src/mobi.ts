import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';
import { FileManifest } from '@friends-library/types';
import { EbookOptions } from './types';
import { writeEbookManifest } from './ebook';
import { red } from '@friends-library/cli-utils/color';
import { dirs } from './dirs';

export default async function mobi(
  manifest: FileManifest,
  filename: string,
  opts: EbookOptions,
): Promise<string> {
  // const { ARTIFACT_DIR, SRC_DIR } = dirs(opts);
  // const manifest = await getMobiManifest(job);
  const filePath = await writeEbookManifest(manifest, filename, opts, 'mobi');

  try {
    await kindlegen(filePath, filename);
  } catch (err) {
    red(`Error generating MOBI ${filename}:`);
    red(err);
    process.exit();
  }

  return filePath;
}

function kindlegen(precursorPath: string, filename: string): Promise<void> {
  const bin = path.resolve(
    path.dirname(require.main!.filename), // eslint-disable-line @typescript-eslint/no-non-null-assertion
    '../../node_modules/kindlegen/bin/kindlegen',
  );

  if (!fs.existsSync(bin)) {
    throw new Error(`kindlegen binary not found at path: \`${bin}\``);
  }

  const stream = spawn(bin, [precursorPath, '-c2', '-verbose', '-o', filename]);

  return new Promise((resolve, reject) => {
    let errors: string[] = [];
    stream.stdout.on('data', data => {
      const lines: string[] = data.toString().split('\n');
      errors = errors.concat(lines.filter(l => l.match(/^Error/)));
    });

    stream.on('close', code => {
      if ([0, 1, 2].includes(code) === false || errors.length) {
        const errorsString = errors.length ? `\n${errors.join('\n')}` : '';
        reject(new Error(`kindlegen returned code ${code}${errorsString}`));
        return;
      }

      fs.remove(precursorPath);
      resolve();
    });
  });
}
