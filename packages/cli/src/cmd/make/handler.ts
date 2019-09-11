import { sync as glob } from 'glob';
import { Arguments } from 'yargs';
import env from '@friends-library/env';
import { processDocument } from '@friends-library/adoc-convert';
import { paperbackInteriorManifest } from '@friends-library/kite';
import FsDocPrecursor from '../../fs-precursor/FsDocPrecursor';
import * as hydrate from '../../fs-precursor/hydrate';

interface MakeOptions {
  pattern: string;
  isolate?: number;
}

export default async function handler(argv: Arguments<MakeOptions>): Promise<void> {
  const { pattern, isolate } = argv;
  const dpcs = await getFsPrecursorsByPattern(pattern);

  dpcs.forEach(hydrate.meta);
  dpcs.forEach(hydrate.revision);
  dpcs.forEach(hydrate.config);
  dpcs.forEach(hydrate.customCode);
  dpcs.forEach(dpc => hydrate.asciidoc(dpc, isolate || undefined));

  dpcs.forEach(dpc => {
    const { logs, notes, sections, epigraphs } = processDocument(dpc.asciidoc);
    if (logs.length) {
      console.error(logs);
      throw new Error('Asciidoc conversion error/s, see ^^^');
    }
    dpc.notes = notes;
    dpc.sections = sections;
    dpc.epigraphs = epigraphs;
  });

  // doc-manifests, doc-css, doc-artifacts

  // @TODO -- determine target/s from cli input
  const targets = ['pdf-print'];

  dpcs.forEach(dpc => {
    targets.forEach(async target => {
      const manifest = await paperbackInteriorManifest(dpc);
    });
  });
}

function getFsPrecursorsByPattern(pattern?: string): FsDocPrecursor[] {
  const { DOCS_REPOS_ROOT } = env.require('DOCS_REPOS_ROOT');
  return glob(`${DOCS_REPOS_ROOT}/{es,en}/*/*/*/`)
    .filter(path => !pattern || path.includes(pattern))
    .map(path => path.replace(/\/$/, ''))
    .map(path => new FsDocPrecursor(path, path.replace(DOCS_REPOS_ROOT, '')));
}
