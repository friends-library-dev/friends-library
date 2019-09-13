import { FileManifest } from '@friends-library/types';
import { PdfOptions } from './types';
export default function pdf(manifest: FileManifest, filename: string, opts?: PdfOptions): Promise<string>;
