import paperbackInterior from './paperback-interior';
import { ArtifactType, DocPrecursor, FileManifest } from '@friends-library/types';
import { PaperbackInteriorConfig } from '@friends-library/types';
export { paperbackInterior };
export declare function create(type: ArtifactType, dpc: DocPrecursor, options: PaperbackInteriorConfig): Promise<FileManifest[]>;
