import fs from 'fs';
import mapValues from 'lodash/mapValues';
import {
  DocPrecursor,
  PaperbackInteriorConfig,
  Css,
  PrintSizeDetails,
} from '@friends-library/types';
import { getPrintSizeDetails } from '@friends-library/lulu';

export function paperbackInterior(dpc: DocPrecursor, conf: PaperbackInteriorConfig): Css {
  const css = [
    'common',
    'pdf/base',
    'pdf/typography',
    'pdf/half-title',
    'pdf/original-title',
    'pdf/copyright',
    'pdf/toc',
    'pdf/chapter-heading',
    'pdf/paperback-interior',
    ...(dpc.notes.size < 5 ? ['pdf/symbol-notes'] : []),
    ...(conf.condense ? ['pdf/condense'] : []),
  ]
    .map(file => `${__dirname}/../src/css/${file}.css`)
    .map(file => fs.readFileSync(file).toString())
    .join('\n');

  return replaceVars(css, dpc, conf);
}

function replaceVars(css: Css, dpc: DocPrecursor, conf: PaperbackInteriorConfig): Css {
  const { sections, meta, config } = dpc;
  const size = getPrintSizeDetails(conf.printSize);
  const { dims, margins } = size;
  const runningHead =
    sections.length === 1 ? meta.author.name : config.shortTitle || meta.title;

  const vars: { [k: string]: string } = {
    '--running-head-title': `"${runningHead}"`,
    '--chapter-margin-top': `${dims.height / 4}in`,
    '--copyright-page-height': `${dims.height - margins.top - margins.bottom}in`,
    '--half-title-page-height': `${dims.height - (margins.top + margins.bottom) * 3}in`,
    ...printDims(size),
    ...condenseVars(dims.height),
  };

  return css.replace(/var\((--[^\)]+)\)/g, (_, varId) => {
    return vars[varId];
  });
}

function condenseVars(pageHeight: number): { [k: string]: string } {
  const topMargin = 0.7;
  const btmMargin = 0.55;
  return {
    '--condensed-copyright-page-height': `${pageHeight - topMargin - btmMargin}in`,
    '--condensed-half-title-page-height': `${pageHeight - (topMargin + btmMargin) * 3}in`,
    '--condensed-page-top-margin': `${topMargin}in`,
    '--condensed-page-bottom-margin': `${btmMargin}in`,
  };
}

export function printDims(size: PrintSizeDetails): { [key: string]: string } {
  return mapValues(
    {
      '--page-width': size.dims.width,
      '--page-height': size.dims.height,
      '--page-top-margin': size.margins.top,
      '--page-bottom-margin': size.margins.bottom,
      '--page-outer-margin': size.margins.outer,
      '--page-inner-margin': size.margins.inner,
      '--running-head-margin-top': size.margins.runningHeadTop,
    },
    v => `${v}in`,
  );
}
