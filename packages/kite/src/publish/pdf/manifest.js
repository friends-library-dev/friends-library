// @flow
import { flow } from 'lodash';
import { toRoman } from 'roman-numerals';
import type { Job, FileManifest, Css, Html, Heading } from '../../type';
import { file, toCss } from '../file';
import { replaceHeadings } from '../headings';
import { removeMobiBrs } from '../html';
import { frontmatter } from './frontmatter';

export function getPdfManifest(job: Job): FileManifest {
  return {
    'book.html': getHtml(job),
    'book.css': getCss(job),
    'line.svg': file('pdf/line.svg'),
  };
}

function getCss({ target, spec }: Job): Css {
  return [
    'sass/common.scss',
    'pdf/sass/base.scss',
    'pdf/sass/typography.scss',
    'pdf/sass/half-title.scss',
    'pdf/sass/original-title.scss',
    'pdf/sass/copyright.scss',
    'pdf/sass/toc.scss',
    'pdf/sass/chapter-heading.scss',
    ...target === 'pdf-web' ? ['pdf/sass/web.scss'] : ['pdf/sass/print.scss'],
  ]
    .map(toCss)
    .join('\n')
    .replace(/{{{ header.title }}}/g, spec.meta.title);
}

function getHtml(job: Job): Html {
  return flow([
    joinSections,
    addFirstChapterClass,
    inlineNotes,
    prependFrontmatter,
    ([html, j]) => [removeMobiBrs(html), j],
    wrapHtml,
  ])(['', job])[0];
}

function joinSections([_, job]: [Html, Job]): [Html, Job] {
  const joined = job.spec.sections.map(({ html, heading }) => {
    return replaceHeadings(html, heading, job)
      .replace(
        '<div class="sectionbody">',
        `<div class="sectionbody" short="${runningHeader(heading)}">`,
      );
  }).join('\n');

  return [joined, job];
}

function runningHeader({ shortText, text, sequence }: Heading): string {
  if (shortText || text || !sequence) {
    return shortText || text;
  }

  return `${sequence.type} ${toRoman(sequence.number)}`;
}

function addFirstChapterClass([html, job]: [Html, Job]): [Html, Job] {
  return [html.replace(
    '<div class="sect1">',
    '<div class="sect1 first-chapter">',
  ), job];
}

function inlineNotes([html, job]: [Html, Job]): [Html, Job] {
  const { spec: { notes } } = job;
  return [html.replace(
    /{% note: ([a-z0-9-]+) %}/gim,
    (_, id) => `<span class="footnote">${notes.get(id) || ''}</span>`,
  ), job];
}

function wrapHtml([html, job]: [Html, Job]): [Html, Job] {
  const wrapped = `
<!DOCTYPE html>
<html>
<head>
  <link href="book.css" rel="stylesheet" type="text/css">
</head>
<body>
  ${html}
</body>
</html>
`.trim();
  return [wrapped, job];
}

function prependFrontmatter([html, job]: [Html, Job]): [Html, Job] {
  return [frontmatter(job).concat(html), job];
}
