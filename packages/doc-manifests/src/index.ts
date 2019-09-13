import paperbackInterior from './paperback-interior';
import { ArtifactType, DocPrecursor, FileManifest } from '@friends-library/types';

export { paperbackInterior };

export async function create(
  type: ArtifactType,
  dpc: DocPrecursor,
): Promise<FileManifest[]> {
  switch (type) {
    case 'paperback-interior':
      return paperbackInterior(dpc);
  }
  return [];
}
