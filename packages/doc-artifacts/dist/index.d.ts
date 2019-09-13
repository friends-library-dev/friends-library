import pdf from './pdf';
import { FileManifest } from '@friends-library/types';
import { Options } from './types';
export { pdf };
export declare function create(manifest: FileManifest, filename: string, options: Options): Promise<string>;
