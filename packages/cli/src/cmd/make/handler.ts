import { execSync } from 'child_process';
import { Arguments } from 'yargs';
import { red } from '@friends-library/cli-utils/color';
import * as manifest from '@friends-library/doc-manifests';
import * as artifacts from '@friends-library/doc-artifacts';
import * as hydrate from '../../fs-precursor/hydrate';
import * as dpcQuery from '../../fs-precursor/query';
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
  const dpcs = dpcQuery.getByPattern(pattern);
  if (dpcs.length === 0) {
    red(`Pattern: \`${pattern}\` matched 0 docs.`);
    process.exit(1);
  }

  hydrate.all(dpcs, isolate);

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

  !noOpen && files.forEach(file => execSync(`open "${file}"`));
}

async function getTypeManifests(
  type: ArtifactType,
  dpc: DocPrecursor,
  argv: MakeOptions,
): Promise<FileManifest[]> {
  switch (type) {
    case 'web-pdf':
      return manifest.webPdf(dpc);
    case 'paperback-interior': {
      const conf: PaperbackInteriorConfig = {
        frontmatter: !argv.noFrontmatter,
        printSize: 'm', // @TODO
        condense: false, // @TODO
        allowSplits: false,
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
  let suffix = '';
  if (type === 'paperback-cover') suffix = '--(cover)';
  if (type === 'web-pdf') suffix = '--(web)';
  if (type === 'mobi') suffix = `--${Math.floor(Date.now() / 1000)}`;
  return `${dpc.friendInitials.join('')}--${dpc.documentSlug}${suffix}`;
}

function makeSrcPath(dpc: DocPrecursor, idx: number, type: ArtifactType): string {
  let path = makeFilename(dpc, idx, type);
  if (type == 'mobi' || type == 'epub') {
    path += `/${type}`;
  }
  return path;
}
