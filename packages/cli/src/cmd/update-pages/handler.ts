import fs from 'fs-extra';
import parsePdf from 'pdf-parse';
import { log, c } from '@friends-library/cli-utils/color';
import { choosePrintSize } from '@friends-library/lulu';
import { paperbackInterior as paperbackManifest } from '@friends-library/doc-manifests';
import * as artifacts from '@friends-library/doc-artifacts';
import { DocumentMeta, fetchSingleton, save } from '@friends-library/document-meta';
import * as hydrate from '../../fs-precursor/hydrate';
import * as dpcQuery from '../../fs-precursor/query';
import { PrintSizeVariant, DocPrecursor, PageData } from '@friends-library/types';

interface Options {
  forceUpdate: boolean;
}

const variants: PrintSizeVariant[] = ['s', 'm', 'xl', 'xl--condensed'];

export default async function handler({ forceUpdate }: Options): Promise<void> {
  const meta = await fetchSingleton();
  const namespace = 'fl-update-pages';
  artifacts.deleteNamespaceDir(namespace);

  const dpcs = dpcQuery.getByPattern('updated');
  hydrate.all(dpcs);

  for (const dpc of dpcs) {
    if (!forceUpdate && shouldSkip(dpc.path, meta)) {
      continue;
    }

    if (!dpc.edition) {
      throw new Error('Unexpected non-hydrated dpc');
    }

    log(c`\n{gray Determining page numbers for} {green ${dpc.path}}`);
    const singlePageData: PageData['single'] = { s: 0, m: 0, xl: 0, 'xl--condensed': 0 };

    for (const variant of variants) {
      log(c`  {magenta.dim ->} {gray size:} {cyan ${variant}}`);
      const size = variant === 'xl--condensed' ? 'xl' : variant;
      const [manifest] = await paperbackManifest(dpc, {
        printSize: size,
        frontmatter: true,
        allowSplits: false,
        condense: variant === 'xl--condensed',
      });

      const filepath = await artifacts.pdf(manifest, filename(dpc, variant), {
        namespace,
        srcPath: filename(dpc, variant),
      });

      singlePageData[variant] = await getPages(filepath);
    }

    let splitPageData: PageData['split'];
    if (dpc.edition.splits) {
      splitPageData = { m: [], xl: [], 'xl--condensed': [] };
      for (const variant of ['m', 'xl', 'xl--condensed'] as const) {
        log(c`  {magenta.dim ->} {gray size (split):} {cyan ${variant}}`);
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
          const filepath = await artifacts.pdf(manifest, volFilename, {
            namespace,
            srcPath: volFilename,
          });
          splitPageData[variant].push(await getPages(filepath));
        }
      }
    }

    const [size, condense] = choosePrintSize(singlePageData, splitPageData);
    const sizeVariant = `${size}${condense ? '--condensed' : ''}` as PrintSizeVariant;
    let volumes = [singlePageData[sizeVariant]];
    if (splitPageData && sizeVariant !== 's') {
      volumes = splitPageData[sizeVariant];
    }

    meta.set(dpc.path, {
      updated: new Date().toISOString(),
      adocLength: dpc.asciidoc.length,
      numSections: dpc.sections.length,
      paperback: {
        size,
        condense,
        volumes,
        pageData: {
          single: singlePageData,
          ...(splitPageData ? { splitPageData } : {}),
        },
      },
    });

    await save(meta);
  }
}

function filename(dpc: DocPrecursor, variant: string, volumeNumber?: number): string {
  return [
    dpc.friendInitials.join(''),
    dpc.documentSlug,
    dpc.editionType,
    variant,
    volumeNumber,
  ]
    .filter(part => !!part)
    .join('--');
}

async function getPages(path: string): Promise<number> {
  const buffer = await fs.readFile(path);
  const { numpages } = await parsePdf(buffer, { max: 1 });
  return numpages;
}

function shouldSkip(id: string, meta: DocumentMeta): boolean {
  const editionMeta = meta.get(id);
  if (!editionMeta) {
    return false;
  }

  return Date.now() - new Date(editionMeta.updated).getTime() < HOURS_IN_MS * 3;
}

const HOURS_IN_MS = 1000 * 60 * 60;
