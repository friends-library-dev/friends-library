import { SourcePrecursor } from '@friends-library/types';
import pdf from 'pdf-parse';
import chalk from 'chalk';
import fs from 'fs-extra';
import { Asset, AssetType } from './handler';
import { bookSizes } from '@friends-library/asciidoc';

type MakeError = (message: string) => InvalidAssetError;

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
  for (const asset of assets) {
    const { path, type } = asset;
    const error = makeError(type, path);

    // validate size
    const { size } = await fs.stat(path);
    if (sizeTooSmall(size, type, adoc.length)) {
      errors.push(error(`Filesize too small -- (${size}) bytes`));
    }

    // validate pdf
    if (type === 'pdf-print' || type === 'pdf-web') {
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

    // validate print size
    if (type === 'pdf-print') {
      const printSizeError = validatePrintSize(asset, error);
      if (printSizeError) errors.push(printSizeError);
    }
  }

  return [errors, assets];
}

function validatePrintSize(asset: Asset, error: MakeError): InvalidAssetError | null {
  const { pdfPages: pages, printSize: size } = asset;
  if (pages === undefined) {
    return error('Unexpected missing pdf page count');
  }

  if (pages < bookSizes[size].minPages || pages > bookSizes[size].maxPages) {
    return error(`Unexpected page count (${pages}) for size: ${size}`);
  }

  return null;
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

class InvalidAssetError extends Error {
  public constructor(message: string, public type: AssetType, public path: string) {
    super(message);
  }

  public print(): void {
    const file = this.path.split('/').pop() || '';
    console.log(`${chalk.bgRed('VALIDATION ERROR')} ${chalk.red(this.message)}`);
    console.log(`   ${chalk.gray('file:')} ${chalk.dim.yellow(file)}`);
    console.log(`   ${chalk.gray('type:')} ${chalk.dim.yellow(this.type)}\n`);
  }
}

function makeError(type: AssetType, path: string): MakeError {
  return message => {
    return new InvalidAssetError(message, type, path);
  };
}

function sizeTooSmall(filesize: number, type: AssetType, adocLength: number): boolean {
  switch (type) {
    case 'epub':
      return filesize < adocLength * 0.35;
    case 'mobi':
      return filesize < adocLength * 1.15;
    case 'pdf-print':
      return filesize < adocLength * 1.5;
    case 'pdf-web':
      return filesize < adocLength * 1.3;
    default:
      return false;
  }
}
