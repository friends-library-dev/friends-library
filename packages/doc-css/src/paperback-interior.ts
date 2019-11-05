import mapValues from 'lodash/mapValues';
import {
  DocPrecursor,
  PaperbackInteriorConfig,
  Css,
  PrintSizeDetails,
  genericDpc,
} from '@friends-library/types';
import { getPrintSizeDetails } from '@friends-library/lulu';
import { runningHead, joinCssFiles, replaceVars } from './helpers';

export default function paperbackInterior(
  dpc: DocPrecursor,
  conf: PaperbackInteriorConfig,
): Css {
  let css = joinCssFiles([
    'common',
    'not-mobi7',
    'pdf/base',
    'pdf/paging',
    'pdf/typography',
    'pdf/half-title',
    'pdf/original-title',
    'pdf/copyright',
    'pdf/toc',
    'pdf/chapter-heading',
    'pdf/paperback-interior',
    ...(dpc.notes.size < 5 ? ['pdf/symbol-notes'] : []),
    ...(conf.condense ? ['pdf/condense'] : []),
  ]);

  const { customCode } = dpc;
  css += customCode.css.all || '';
  css += customCode.css.pdf || '';
  css += customCode.css['paperback-interior'] || ''; // @TODO rename all repo files!!!

  const vars = getVars(dpc, conf);
  return replaceVars(css, vars);
}

function getVars(
  dpc: DocPrecursor,
  conf: PaperbackInteriorConfig,
): Record<string, string> {
  const size = getPrintSizeDetails(conf.printSize);
  const { dims, margins } = size;

  return {
    '--running-head-title': `"${runningHead(dpc)}"`,
    '--chapter-margin-top': `${dims.height / 4}in`,
    '--copyright-page-height': `${dims.height - margins.top - margins.bottom}in`,
    '--half-title-page-height': `${dims.height - (margins.top + margins.bottom) * 3}in`,
    ...printDimsVars(size),
    ...condenseVars(dims.height),
  };
}

function condenseVars(pageHeight: number): Record<string, string> {
  const topMargin = 0.7;
  const btmMargin = 0.55;
  return {
    '--condensed-copyright-page-height': `${pageHeight - topMargin - btmMargin}in`,
    '--condensed-half-title-page-height': `${pageHeight - (topMargin + btmMargin) * 3}in`,
    '--condensed-page-top-margin': `${topMargin}in`,
    '--condensed-page-bottom-margin': `${btmMargin}in`,
  };
}

export function printDimsVars(size: PrintSizeDetails): Record<string, string> {
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

export function generic(): Css {
  return paperbackInterior(genericDpc(), {
    printSize: 'm',
    allowSplits: false,
    frontmatter: false,
    condense: false,
  });
}
