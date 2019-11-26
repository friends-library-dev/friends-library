import fs from 'fs-extra';
import parsePdf from 'pdf-parse';
import { choosePrintSize } from '@friends-library/lulu';
import { log, c, red } from '@friends-library/cli-utils/color';
import * as artifacts from '@friends-library/doc-artifacts';
import { PageData, PrintSizeVariant, EditionMeta } from '@friends-library/types';
import { paperbackInterior as paperbackManifest } from '@friends-library/doc-manifests';
import FsDocPrecursor from '../../fs-precursor/FsDocPrecursor';

const variants: PrintSizeVariant[] = ['s', 'm', 'xl', 'xl--condensed'];

type SinglePages = PageData['single'];
type MultiPages = PageData['split'];
type SingleFiles = { [keyof in PrintSizeVariant]: string };
type MultiFiles = { m: string[]; xl: string[]; 'xl--condensed': string[] } | undefined;

export async function publishPaperback(
  dpc: FsDocPrecursor,
  opts: { namespace: string; srcPath: string },
): Promise<[EditionMeta['paperback'], string[]]> {
  const [singlePages, singleFiles] = await makeSingleVolumes(dpc, opts);
  const [splitPages, splitFiles] = await makeMultiVolumes(dpc, opts);

  try {
    var [size, condense] = choosePrintSize(singlePages, splitPages);
  } catch (error) {
    red(`${dpc.path} exceeds max allowable size, must be split`);
    process.exit(1);
  }

  const sizeVariant = `${size}${condense ? '--condensed' : ''}` as PrintSizeVariant;
  let volumes = [singlePages[sizeVariant]];
  if (splitPages && sizeVariant !== 's') {
    volumes = splitPages[sizeVariant];
  }

  const pageData: EditionMeta['paperback'] = {
    size,
    condense,
    volumes,
    pageData: {
      single: singlePages,
      ...(splitPages ? { split: splitPages } : {}),
    },
  };

  const files =
    splitFiles && sizeVariant !== 's'
      ? splitFiles[sizeVariant]
      : [singleFiles[sizeVariant]];

  return [pageData, files];
}

async function makeSingleVolumes(
  dpc: FsDocPrecursor,
  opts: { namespace: string; srcPath: string },
): Promise<[SinglePages, SingleFiles]> {
  log(c`   {gray Determining paperback interior page counts...}`);
  const pages: SinglePages = { s: 0, m: 0, xl: 0, 'xl--condensed': 0 };
  const files: SingleFiles = { s: '', m: '', xl: '', 'xl--condensed': '' };

  for (const variant of variants) {
    log(c`     {magenta.dim ->} {gray size:} {cyan ${variant}}`);
    const size = variant === 'xl--condensed' ? 'xl' : variant;
    const [manifest] = await paperbackManifest(dpc, {
      printSize: size,
      frontmatter: true,
      allowSplits: false,
      condense: variant === 'xl--condensed',
    });

    const file = filename(dpc, variant);
    const filepath = await artifacts.pdf(manifest, file, opts);
    files[variant] = filepath;
    pages[variant] = await getPages(filepath);
  }

  return [pages, files];
}

async function makeMultiVolumes(
  dpc: FsDocPrecursor,
  opts: { namespace: string; srcPath: string },
): Promise<[MultiPages, MultiFiles]> {
  if (!dpc.edition || !dpc.edition.splits) {
    return [undefined, undefined];
  }

  const pages: MultiPages = { m: [], xl: [], 'xl--condensed': [] };
  const files: MultiFiles = { m: [], xl: [], 'xl--condensed': [] };

  log(c`   {gray Determining paperback interior page counts for split faux-volumes...}`);
  for (const variant of ['m', 'xl', 'xl--condensed'] as const) {
    log(c`     {magenta.dim ->} {gray size (split):} {cyan ${variant}}`);
    const size = variant === 'xl--condensed' ? 'xl' : variant;
    const manifests = await paperbackManifest(dpc, {
      printSize: size,
      frontmatter: true,
      allowSplits: true,
      condense: variant === 'xl--condensed',
    });

    for (let idx = 0; idx < manifests.length; idx++) {
      const manifest = manifests[idx];
      const vol = idx + 1;
      const volFilename = filename(dpc, variant, vol);
      const filepath = await artifacts.pdf(manifest, volFilename, opts);
      files[variant].push(filepath);
      pages[variant].push(await getPages(filepath));
    }
  }

  return [pages, files];
}

async function getPages(path: string): Promise<number> {
  const buffer = await fs.readFile(path);
  const { numpages } = await parsePdf(buffer, { max: 1 });
  return numpages;
}

function filename(dpc: FsDocPrecursor, variant: string, volumeNumber?: number): string {
  return [
    dpc.friendInitials.join(''),
    dpc.documentSlug,
    dpc.editionType,
    dpc.documentId.substring(0, 8),
    variant,
    volumeNumber,
  ]
    .filter(part => !!part)
    .join('--');
}
