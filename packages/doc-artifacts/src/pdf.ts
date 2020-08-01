import fs from 'fs-extra';
import { spawn } from 'child_process';
import env from '@friends-library/env';
import { yellow } from '@friends-library/cli-utils/color';
import { FileManifest } from '@friends-library/types';
import { PdfOptions } from './types';
import { dirs } from './dirs';

export default async function pdf(
  manifest: FileManifest,
  filenameNoExt: string,
  opts: PdfOptions = {},
): Promise<string> {
  const { ARTIFACT_DIR, SRC_DIR } = dirs(opts);
  fs.ensureDirSync(SRC_DIR);

  await Promise.all(
    Object.keys(manifest).map((path) =>
      fs.outputFile(
        `${SRC_DIR}/${path}`,
        manifest[path],
        path.endsWith(`.png`) ? `binary` : undefined,
      ),
    ),
  );

  const src = `${SRC_DIR}/doc.html`;
  const { PRINCE_BIN } = env.require(`PRINCE_BIN`);
  const stream = spawn(PRINCE_BIN, [src]);

  let output = ``;
  await new Promise((resolve, reject) => {
    stream.stderr.on(`data`, (data) => {
      output = output.concat(data.toString());
    });

    stream.on(`close`, (code) => {
      output = output
        .trim()
        .split(`\n`)
        .filter(filterPrinceOutput)
        .map(opts.formatOutput || ((l) => l))
        .join(`\n`);

      if (output) {
        yellow(output);
      }

      return code === 0 ? resolve() : reject(new Error(`prince-books error ${code}`));
    });
  });

  await fs.move(`${SRC_DIR}/doc.pdf`, `${ARTIFACT_DIR}/${filenameNoExt}.pdf`);

  return `${ARTIFACT_DIR}/${filenameNoExt}.pdf`;
}

function filterPrinceOutput(line: string): boolean {
  if (line.trim() === ``) {
    return false;
  }

  if (line.match(/^prince: warning: cannot fit footnote\(s\) on page/)) {
    return false;
  }

  return true;
}
