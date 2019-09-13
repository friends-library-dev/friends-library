import { sync as glob } from 'glob';
import { Arguments } from 'yargs';
import env from '@friends-library/env';
import { red } from '@friends-library/cli-utils/color';
import { processDocument } from '@friends-library/adoc-convert';
import { create as createManifests } from '@friends-library/doc-manifests';
import * as artifacts from '@friends-library/doc-artifacts';
import FsDocPrecursor from '../../fs-precursor/FsDocPrecursor';
import * as hydrate from '../../fs-precursor/hydrate';
import { ArtifactType } from '@friends-library/types';

interface MakeOptions {
  pattern: string;
  isolate?: number;
}

export default async function handler(argv: Arguments<MakeOptions>): Promise<void> {
  const { pattern, isolate } = argv;
  const dpcs = await getFsPrecursorsByPattern(pattern);
  if (dpcs.length === 0) {
    red(`Pattern: \`${pattern}\` matched 0 docs.`);
    process.exit(1);
  }

  fullyHydrate(dpcs, isolate);
  const targets = ['paperback-interior'] as ArtifactType[];

  const files = [];
  dpcs.forEach(dpc => {
    targets.forEach(async target => {
      const manifests = await createManifests(target, dpc);
      manifests.forEach(async manifest => {
        files.push(
          await artifacts.create(manifest, 'some-filename', {
            srcRelPath: 'fl-test',
          }),
        );
      });
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

function fullyHydrate(dpcs: FsDocPrecursor[], isolate?: number): void {
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
}
