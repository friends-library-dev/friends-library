import { SourcePrecursor, DocumentArtifacts, PrintSize } from '@friends-library/types';
import pdf from 'pdf-parse';
import fs from 'fs-extra';
import { Asset } from './handler';
import { bookSizes } from '@friends-library/asciidoc';
import { log, c } from '@friends-library/cli/color';

type MakeError = (message: string) => InvalidAssetError;

export default async function validate(
  assets: Asset[],
  precursor: SourcePrecursor,
): Promise<void> {
  const errors = await inspectAssets(assets, precursor);
  if (errors.length) {
    process.stdout.write('\n');
    errors.forEach(e => e.print());
    process.exit(1);
  }
}

async function inspectAssets(
  assets: Asset[],
  { meta: { author, title }, adoc }: SourcePrecursor,
): Promise<InvalidAssetError[]> {
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
    let text = '';
    let numpages = -1;
    if (type === 'pdf-print' || type === 'pdf-web') {
      try {
        ({ text, numpages } = await parsePdf(path));
        if (!pdfTextHas(text, author.name) || !pdfTextHas(text, title)) {
          errors.push(error('PDF missing text author/title'));
        }
      } catch (e) {
        errors.push(error('Un-parsable PDF'));
      }
    }

    // validate print size
    if (type === 'pdf-print') {
      const printSizeError = validatePrintSize(asset.printSize, numpages, error);
      if (printSizeError) errors.push(printSizeError);
    }
  }

  return errors;
}

async function parsePdf(path: string): ReturnType<typeof pdf> {
  const buffer = await fs.readFile(path);
  return pdf(buffer, { max: 1 });
}

export async function confirmPrintSize(
  artifacts: DocumentArtifacts[],
  printSize: PrintSize,
): Promise<{
  sizeCorrect: boolean;
  otherSizes: PrintSize[];
  numPages: number;
}> {
  const printFilePath = artifacts.filter(artifact =>
    artifact.srcDir.endsWith('pdf-print'),
  )[0].filePath;

  const otherSizes = <PrintSize[]>['s', 'm', 'xl'].filter(s => s !== printSize);
  let numPages = -1;
  let sizeCorrect = true;

  try {
    ({ numpages: numPages } = await parsePdf(printFilePath));
    sizeCorrect = !sizeInvalid(numPages, printSize);
  } catch {
    const error = new InvalidAssetError(
      "Unparseable PDF, can't count pages",
      'pdf-print',
      printFilePath,
    );
    error.print();
    process.exit(1);
  }

  return { sizeCorrect, otherSizes, numPages };
}

function validatePrintSize(
  size: PrintSize,
  pages: number,
  error: MakeError,
): InvalidAssetError | null {
  if (pages === undefined) {
    return error('Unexpected missing pdf page count');
  }

  if (sizeInvalid(pages, size)) {
    return error(`Unexpected page count (${pages}) for size: ${size}`);
  }

  return null;
}

export function sizeInvalid(pages: number, size: PrintSize): boolean {
  return pages < bookSizes[size].minPages || pages > bookSizes[size].maxPages;
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
  public constructor(message: string, public type: Asset['type'], public path: string) {
    super(message);
  }

  public print(): void {
    const file = this.path.split('/').pop() || '';
    log(c`{bgRed VALIDATION ERROR} {red ${this.message}}`);
    log(c`   {gray file:} {yellow.dim ${file}}`);
    log(c`   {gray type:} {yellow.dim ${this.type}}`);
  }
}

function makeError(type: Asset['type'], path: string): MakeError {
  return message => {
    return new InvalidAssetError(message, type, path);
  };
}

function sizeTooSmall(
  filesize: number,
  type: Asset['type'],
  adocLength: number,
): boolean {
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
