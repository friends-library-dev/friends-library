import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';
import env from '@friends-library/env';
import { yellow } from '@friends-library/cli-utils/color';
import { FileManifest } from '@friends-library/types';
import { PdfOptions, Options } from './types';

export default function pdf(
  manifest: FileManifest,
  filename: string,
  opts: PdfOptions = {},
): Promise<string> {
  const { ARTIFACT_DIR, SRC_DIR } = dirs(opts);
  fs.ensureDirSync(SRC_DIR);

  const writeFiles = Promise.all(
    Object.keys(manifest).map(path =>
      fs.outputFile(
        `${SRC_DIR}/${path}`,
        manifest[path],
        path.endsWith('.png') ? 'binary' : undefined,
      ),
    ),
  );

  const { PRINCE_BIN } = env.require('PRINCE_BIN');
  return writeFiles
    .then(() => {
      const src = `${ARTIFACT_DIR}/doc.html`;
      const stream = spawn(PRINCE_BIN || '/usr/local/bin/prince-books', [src]);
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
            .map(opts.formatOutput || (l => l))
            .join('\n');

          if (output) {
            yellow(output);
          }

          return code === 0 ? resolve() : reject(new Error(`prince-books error ${code}`));
        });
      });
    })
    .then(() => {
      return fs.move(`${SRC_DIR}/doc.pdf`, `${ARTIFACT_DIR}/${filename}`);
    })
    .then(() => {
      return `${ARTIFACT_DIR}/${filename}`;
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

function dirs(opts: Options): { ARTIFACT_DIR: string; SRC_DIR: string } {
  const namespace = opts.namespace || `ns_auto_gen_${Date.now()}`;
  const srcPath = opts.srcPath || `src_path_auto_gen_${Date.now()}`;
  const ROOT_DIR = path.resolve(__dirname, '..', 'artifacts');
  const ARTIFACT_DIR = path.resolve(ROOT_DIR, namespace);
  const SRC_DIR = path.resolve(ARTIFACT_DIR, 'src', srcPath);
  return { ARTIFACT_DIR, SRC_DIR };
}
