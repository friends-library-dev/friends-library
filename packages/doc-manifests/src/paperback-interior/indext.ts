import { DocPrecursor, FileManifest } from '@friends-library/types';

export default async function paperbackInteriorManifest(
  dpc: DocPrecursor,
): Promise<FileManifest> {
  return {
    'doc.html': `<!DOCTYPE html>\n<html><head><link href="doc.css" rel="stylesheet" type="text/css"></head><body><h1>${dpc.meta.title}</h1></body></html>`,
    'doc.css': 'h1 { color: red; }',
  };
}
