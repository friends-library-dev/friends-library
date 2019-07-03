import fs from 'fs-extra';
import pdf from 'pdf-parse';
import { sync as glob } from 'glob';
import { DocumentMeta } from '@friends-library/client';
import { precursorFromSourceDoc } from '../update/publish';
import { getAllSourceDocs } from '../update/source';
import { log, c } from '@friends-library/cli/color';
import {
  PublishPrecursorOpts,
  publishPrecursors,
  prepPublishDir,
} from '../publish/handler';
import {
  PrintSize as Size,
  SourcePrecursor as Precursor,
  DocumentArtifacts,
} from '@friends-library/types';

interface Options {
  forceUpdate: boolean;
}

export default async function handler({ forceUpdate }: Options): Promise<void> {
  const meta = new DocumentMeta();
  await meta.load();
  const docs = getAllSourceDocs();

  for (const doc of docs) {
    const path = `${doc.friend.lang}${doc.edition.url()}`;
    if (!forceUpdate && shouldSkip(path, meta)) {
      continue;
    }

    log(c`\n{gray Determining page numbers for} {green ${path}}`);
    const precursor = precursorFromSourceDoc(doc);
    const pages: { [k in Size]: number } = { s: 0, m: 0, xl: 0 };
    for (const size of ['s', 'm', 'xl'] as const) {
      log(c`  {magenta.dim ->} {gray size:} {cyan ${size}}`);
      pages[size] = await getPages(await makePdf(precursor, size));
    }

    meta.set(path, {
      updated: new Date().toISOString(),
      adocLength: precursor.adoc.length,
      numSections: glob(`${doc.fullPath}/*.adoc`).length,
      pages,
    });

    await meta.persist();
  }
}

async function makePdf(
  precursor: Precursor,
  printSize: Size,
): Promise<DocumentArtifacts> {
  prepPublishDir();
  const [pdf] = await publishPrecursors([precursor], opts(printSize));
  return pdf;
}

async function getPages({ filePath: path }: DocumentArtifacts): Promise<number> {
  const buffer = await fs.readFile(path);
  const { numpages } = await pdf(buffer, { max: 1 });
  return numpages;
}

function shouldSkip(id: string, meta: DocumentMeta): boolean {
  if (!meta.has(id)) {
    return false;
  }

  const updated = meta.getIn(id, 'updated');
  if (typeof updated !== 'string') {
    return false;
  }

  return Date.now() - new Date(updated).getTime() < HOURS_IN_MS * 3;
}

function opts(printSize: Size): PublishPrecursorOpts {
  return {
    perform: true,
    check: false,
    noFrontmatter: false,
    condense: false,
    createEbookCover: false,
    printSize,
    open: false,
    email: '',
    send: false,
    target: ['pdf-print'],
  };
}

const HOURS_IN_MS = 1000 * 60 * 60;
