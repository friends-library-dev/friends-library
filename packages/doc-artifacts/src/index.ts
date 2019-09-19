import pdf from './pdf';
import epub from './epub';
import mobi from './mobi';
import { FileManifest } from '@friends-library/types';
import { PdfOptions, EbookOptions } from './types';

export { pdf };
export { deleteNamespaceDir } from './dirs';

export async function create(
  manifest: FileManifest,
  filename: string,
  options: PdfOptions & EbookOptions,
): Promise<string> {
  if (manifest['line.svg']) {
    return pdf(manifest, filename, options);
  }

  if (manifest['OEBPS/nav.xhtml'].includes('http-equiv')) {
    return mobi(manifest, filename, options);
  }

  return epub(manifest, filename, options);
}
