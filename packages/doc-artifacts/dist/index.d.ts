import pdf from './pdf';
import { FileManifest } from '@friends-library/types';
import { PdfOptions, EbookOptions } from './types';
export { pdf };
export { deleteNamespaceDir } from './dirs';
export declare function create(manifest: FileManifest, filenameNoExt: string, options: PdfOptions & EbookOptions): Promise<string>;
