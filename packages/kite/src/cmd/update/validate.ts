import { SourcePrecursor, FileType } from '@friends-library/types';
import pdf from 'pdf-parse';
import chalk from 'chalk';
import fs from 'fs-extra';
import { Asset } from './handler';

export default async function validate(
  assets: Asset[],
  precursor: SourcePrecursor,
): Promise<Asset[]> {
  const [errors, augmentedAssets] = await inspectAssets(assets, precursor);
  if (errors.length) {
    process.stdout.write('\n');
    errors.forEach(e => e.print());
    process.exit(1);
  }
  return augmentedAssets;
}

async function inspectAssets(
  assets: Asset[],
  { meta: { author, title }, adoc }: SourcePrecursor,
): Promise<[InvalidAssetError[], Asset[]]> {
  const errors: InvalidAssetError[] = [];
  const adocLength = adoc.length;
  for (const asset of assets) {
    const { path, target } = asset;
    const error = makeError(target, path);

    // validate size
    const { size } = await fs.stat(path);
    if (size < adocLength * sizeMultipliers[target]) {
      errors.push(error(`Filesize too small -- (${size}) bytes`));
    }

    // validate pdf
    if (target === 'pdf-print' || target === 'pdf-web') {
      const buffer = await fs.readFile(path);
      try {
        const { text, numpages } = await pdf(buffer, { max: 1 });
        asset.pdfPages = numpages;
        if (!pdfTextHas(text, author.name) || !pdfTextHas(text, title)) {
          errors.push(error('PDF missing text author/title'));
        }
      } catch (e) {
        errors.push(error('Un-parsable PDF'));
      }
    }
  }

  return [errors, assets];
}

/**
 * pdf-parse` returns sort of garbled text from it's parsing
 * so just do a sanity check that the words all appear somewhere
 */
function pdfTextHas(text: string, test: string): boolean {
  const parts = test.split(' ');
  for (const part of parts) {
    if (!text.includes(part)) {
      return false;
    }
  }
  return true;
}

const sizeMultipliers: { [k in FileType]: number } = {
  epub: 0.4,
  mobi: 1.25,
  'pdf-print': 1.5,
  'pdf-web': 1.3,
};

class InvalidAssetError extends Error {
  public constructor(message: string, public target: FileType, public path: string) {
    super(message);
  }

  public print(): void {
    const file = this.path.split('/').pop() || '';
    console.log(`${chalk.bgRed('VALIDATION ERROR')} ${chalk.red(this.message)}`);
    console.log(`   ${chalk.gray('file:')} ${chalk.dim.yellow(file)}`);
    console.log(`   ${chalk.gray('target:')} ${chalk.dim.yellow(this.target)}\n`);
  }
}

function makeError(
  target: FileType,
  path: string,
): (message: string) => InvalidAssetError {
  return message => {
    return new InvalidAssetError(message, target, path);
  };
}
