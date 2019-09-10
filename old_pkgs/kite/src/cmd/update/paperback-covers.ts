import path from 'path';
import fs from 'fs';
import { SourcePrecursor, CoverProps } from '@friends-library/types';
import { coverFromProps } from '../cover/handler';
import { newCoverNeeded } from './filters';
import { Asset } from './handler';
import { SourceDocument } from './source';

export async function getPaperbackCovers(
  assets: Asset[],
  precursor: SourcePrecursor,
  sourceDoc: SourceDocument,
): Promise<Asset[]> {
  const candidates = assets
    .filter(({ type: target }) => target === 'pdf-print')
    .reduce(
      (makeCovers, asset) => {
        if (newCoverNeeded(asset)) {
          makeCovers.push(asset);
        }
        return makeCovers;
      },
      [] as Asset[],
    );

  const coverAssets: Asset[] = [];
  for (const candidate of candidates) {
    coverAssets.push(await makeCoverAsset(candidate, precursor, sourceDoc));
  }

  return coverAssets;
}

async function makeCoverAsset(
  asset: Asset,
  { meta, filename: basename, lang }: SourcePrecursor,
  { edition, fullPath }: SourceDocument,
): Promise<Asset> {
  const pages = asset.pdfPages;
  if (pages === undefined) {
    throw new Error(`Missing pdf pages for ${edition.url()}`);
  }

  const coverProps: CoverProps = {
    title: meta.title,
    author: meta.author.name,
    blurb: edition.paperbackCoverBlurb(),
    edition: lang === 'es' ? 'spanish' : edition.type,
    pages,
    size: asset.printSize,
    showGuides: false,
    ...getCustomCode(fullPath),
  };

  const filename = `${basename}--cover.pdf`;
  const filepath = await coverFromProps(coverProps, filename, `${basename}/cover`);

  return {
    ...asset,
    type: 'paperback-cover',
    filename: path.basename(filepath),
    path: filepath,
  };
}

function getCustomCode(fullPath: string): { customCss: string; customHtml: string } {
  let customCss = '';
  let customHtml = '';

  const docPath = path.resolve(fullPath, '..');
  if (fs.existsSync(`${docPath}/cover.css`)) {
    customCss = fs.readFileSync(`${docPath}/cover.css`).toString();
  }
  if (fs.existsSync(`${docPath}/cover.html`)) {
    customHtml = fs.readFileSync(`${docPath}/cover.html`).toString();
  }

  return { customCss, customHtml };
}
