import pdf from './pdf';
import epub from './epub';
import mobi from './mobi';
import { FileManifest } from '@friends-library/types';
import { PdfOptions, EbookOptions } from './types';

export { pdf };
export { deleteNamespaceDir, dirs } from './dirs';

export async function create(
  manifest: FileManifest,
  filenameNoExt: string,
  options: PdfOptions & EbookOptions,
): Promise<string> {
  if (Object.keys(manifest).length < 4) {
    return pdf(manifest, filenameNoExt, options);
  }

  if (manifest['OEBPS/nav.xhtml'].includes('http-equiv')) {
    return mobi(manifest, filenameNoExt, options);
  }

  return epub(manifest, filenameNoExt, options);
}
