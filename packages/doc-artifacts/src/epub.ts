import { FileManifest } from '@friends-library/types';
import { EbookOptions } from './types';
import { writeEbookManifest } from './ebook';

export default async function epub(
  manifest: FileManifest,
  filename: string,
  opts: EbookOptions,
): Promise<string> {
  return await writeEbookManifest(manifest, filename, opts, 'epub');
}
