import fs from 'fs-extra';
import { sync as glob } from 'glob';
import { choosePrintSize } from '@friends-library/asciidoc';
import { PrintSize, DocumentArtifacts, SourcePrecursor } from '@friends-library/types';
import { publishPrecursors } from '../publish/handler';
import { red } from '@friends-library/cli/color';
import { logResize } from '../../../../../packages/cli/src/cmd/publish/log';
import { PublishOptions } from './publish';
import { confirmPrintSize } from './validate';
import { getDocumentMeta } from '@friends-library/client';

export async function estimatePrintSize(
  sourceDocPath: string,
  adocLength: number,
): Promise<PrintSize> {
  const meta = await getDocumentMeta();
  const sections = glob(`${sourceDocPath}/*.adoc`).length;

  const estimatedPages = {
    s: meta.estimatePages(adocLength, sections, 's'),
    m: meta.estimatePages(adocLength, sections, 'm'),
  };

  return choosePrintSize(estimatedPages);
}

export async function resizePrintPdf(
  artifacts: DocumentArtifacts[],
  precursor: SourcePrecursor,
  options: PublishOptions,
  otherSizes: PrintSize[],
): Promise<[number, PrintSize]> {
  if (otherSizes.length === 0) {
    red(`Failure to resize print PDF for ${precursor.id}, no alternate sizes!`);
    process.exit(1);
  }

  const newSize = <PrintSize>otherSizes.pop();
  logResize(newSize, precursor.id);

  const newOptions: PublishOptions = {
    ...options,
    printSize: newSize,
    condense: shouldCondense(newSize, precursor.adoc.length),
    target: ['pdf-print'],
  };

  const existingPath = artifacts.filter(a => a.srcDir.endsWith('pdf-print'))[0].filePath;
  await fs.unlink(existingPath);

  const [artifact] = await publishPrecursors([precursor], newOptions);
  const { sizeCorrect, numPages } = await confirmPrintSize([artifact], newSize);
  if (!sizeCorrect) {
    return resizePrintPdf(artifacts, precursor, options, otherSizes);
  }

  return [numPages, newSize];
}

export function shouldCondense(printSize: PrintSize, adocLength: number): boolean {
  return printSize === 'xl' && adocLength > 1000000;
}
