import pdf from './pdf';
import { FileManifest } from '@friends-library/types';
import { Options } from './types';

export { pdf };

export async function create(
  manifest: FileManifest,
  filename: string,
  options: Options,
): Promise<string> {
  // @TODO determine artifact type from manifest
  return pdf(manifest, filename, options);
}
