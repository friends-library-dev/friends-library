import pdf from './pdf';
import { FileManifest } from '@friends-library/types';
import { Options } from './types';

export { pdf };
export { deleteNamespaceDir } from './dirs';

export async function create(
  manifest: FileManifest,
  filename: string,
  options: Options,
): Promise<string> {
  if (manifest['line.svg']) {
    return pdf(manifest, filename, options);
  }
  console.log(manifest);
  process.exit(1);
  return '';
}
