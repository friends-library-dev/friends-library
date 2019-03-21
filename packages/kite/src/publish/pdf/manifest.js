// @flow
import { pdfHtml, getTrim } from '@friends-library/asciidoc';
import { flow, mapValues } from 'lodash';
import { toRoman } from 'roman-numerals';
import type { Css, Html } from '../../../../../type';
import type { Job, FileManifest, Heading, PrintSize } from '../../type';
import { file, toCss } from '../file';
import { removeMobi7Tags } from '../html';

export function getPdfManifest(job: Job): FileManifest {
  return {
    'doc.html': pdfHtml(job)
      .replace('</head>', '<link href="doc.css" rel="stylesheet" type="text/css"></head>'),
    'doc.css': getCss(job),
    'line.svg': file('pdf/line.svg'),
  };
}

export function getCss(job: Job): Css {
  const { target, spec: { notes, customCss }, meta: { condense } } = job;
  const vars = getSassVars(job);
  return [
    'sass/common.scss',
    'sass/not-mobi7.scss',
    'sass/paging.scss',
    'pdf/sass/base.scss',
    'pdf/sass/typography.scss',
    'pdf/sass/half-title.scss',
    'pdf/sass/original-title.scss',
    'pdf/sass/copyright.scss',
    'pdf/sass/toc.scss',
    'pdf/sass/chapter-heading.scss',
    ...target === 'pdf-print' ? ['pdf/sass/print.scss'] : ['pdf/sass/web.scss'],
    ...notes.size < 5 ? ['pdf/sass/symbol-notes.scss'] : [],
    ...condense ? ['pdf/sass/condense.scss'] : [],
  ]
    .map(path => toCss(path, vars))
    .join('\n')
    .concat(customCss.all || '')
    .concat(customCss.pdf || '')
    .concat(customCss[target] || '');
}

function getSassVars(job: Job): { [string]: string } {
  const { target, spec: { meta, sections, config } } = job;
  const title = sections.length === 1 ? meta.author.name : config.shortTitle || meta.title;
  return {
    'running-head-title': `"${title}"`,
    ...target === 'pdf-print' ? printDims(job) : {},
  };
}

export function printDims(job: Job): { [string]: string } {
  const trim = getTrim(job);
  return mapValues({
    'page-width': trim.dims.width,
    'page-height': trim.dims.height,
    'page-top-margin': trim.margins.top,
    'page-bottom-margin': trim.margins.bottom,
    'page-outer-margin': trim.margins.outer,
    'page-inner-margin': trim.margins.inner,
    'running-head-margin-top': trim.margins.runningHeadTop,
  }, v => `${v}in`);
}
