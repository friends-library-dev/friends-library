import { execSync } from 'child_process';
import { sync as glob } from 'glob';
import { Arguments } from 'yargs';
import env from '@friends-library/env';
import { red } from '@friends-library/cli-utils/color';
import { processDocument } from '@friends-library/adoc-convert';
import * as manifest from '@friends-library/doc-manifests';
import * as artifacts from '@friends-library/doc-artifacts';
import FsDocPrecursor from '../../fs-precursor/FsDocPrecursor';
import * as hydrate from '../../fs-precursor/hydrate';
import {
  ArtifactType,
  DocPrecursor,
  FileManifest,
  PaperbackInteriorConfig,
  EbookConfig,
} from '@friends-library/types';

interface MakeOptions {
  pattern: string;
  isolate?: number;
  noOpen: boolean;
  noFrontmatter: boolean;
  target: ArtifactType[];
}

export default async function handler(argv: Arguments<MakeOptions>): Promise<void> {
  const { noOpen, pattern, isolate, target } = argv;
  const dpcs = getFsPrecursorsByPattern(pattern);
  if (dpcs.length === 0) {
    red(`Pattern: \`${pattern}\` matched 0 docs.`);
    process.exit(1);
  }

  fullyHydrate(dpcs, isolate);

  const namespace = 'fl-make';
  artifacts.deleteNamespaceDir(namespace);

  const files: string[] = [];
  for (const dpc of dpcs) {
    for (const type of target) {
      const manifests = await getTypeManifests(type, dpc, argv);
      for (let idx = 0; idx < manifests.length; idx++) {
        const filename = makeFilename(dpc, idx, type);
        const srcPath = makeSrcPath(dpc, idx, type);
        const options = { namespace, srcPath, check: true };
        files.push(await artifacts.create(manifests[idx], filename, options));
      }
    }
  }

  !noOpen && files.forEach(file => execSync(`open ${file}`));
}

async function getTypeManifests(
  type: ArtifactType,
  dpc: DocPrecursor,
  argv: MakeOptions,
): Promise<FileManifest[]> {
  switch (type) {
    case 'paperback-interior': {
      const conf: PaperbackInteriorConfig = {
        frontmatter: !argv.noFrontmatter,
        printSize: 'm', // @TODO
        condense: false, // @TODO
      };
      return manifest.paperbackInterior(dpc, conf);
    }
    case 'mobi':
    case 'epub': {
      const conf: EbookConfig = {
        frontmatter: !argv.noFrontmatter,
        subType: type,
        randomizeForLocalTesting: true,
      };
      return manifest[type](dpc, conf);
    }
  }
  return [];
}

function makeFilename(dpc: DocPrecursor, idx: number, type: ArtifactType): string {
  const initials = dpc.friendSlug
    .split('-')
    .map(s => s[0].toUpperCase())
    .join('');
  let suffix = '';
  if (type === 'paperback-cover') suffix = '--(cover)';
  if (type === 'web-pdf') suffix = '--(web)';
  if (type === 'mobi') suffix = `--${Math.floor(Date.now() / 1000)}`;
  return `${initials}--${dpc.documentSlug}${suffix}`;
}

function makeSrcPath(dpc: DocPrecursor, idx: number, type: ArtifactType): string {
  let path = makeFilename(dpc, idx, type);
  if (type == 'mobi' || type == 'epub') {
    path += `/${type}`;
  }
  return path;
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
