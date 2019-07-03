import { Job, Html, Heading, Lang, PrintSizeDetails } from '@friends-library/types';
import stripIndent from 'strip-indent';
import { flow } from 'lodash';
import { replaceHeadings } from './headings';
import { capitalizeTitle, trimTrailingPunctuation, removeMobi7Tags } from './helpers';
import { toRoman } from 'roman-numerals';
import { pdfFrontmatter } from './pdf-frontmatter';
import { getBookSize } from './book-size';

export function pdfHtml(job: Job): Html {
  return flow([
    joinSections,
    addFirstChapterClass,
    inlineNotes,
    prependFrontmatter,
    ([html, j]) => [removeMobi7Tags(html), j],
    wrapHtml,
    addBodyClasses,
  ])(['', job])[0];
}

export function embeddablePdfHtml(job: Job): Html {
  return pdfHtml(job)
    .replace(/[\s\S]+?<div class="sect1/gim, '<div class="sect1')
    .replace(/\s*<\/body>\s*<\/html>\s*/, '');
}

function joinSections([, job]: [Html, Job]): [Html, Job] {
  const joined = job.spec.sections
    .map(({ html, heading }) => {
      return replaceHeadings(html, heading, job).replace(
        '<div class="sectionbody">',
        `<div class="sectionbody" short="${runningHeader(heading, job.spec.lang)}">`,
      );
    })
    .join('\n');
  return [joined, job];
}

function runningHeader({ shortText, text, sequence }: Heading, lang: Lang): string {
  if (shortText || text || !sequence) {
    return capitalizeTitle(trimTrailingPunctuation(shortText || text), lang).replace(
      / \/ .+/,
      '',
    );
  }
  return `${sequence.type} ${toRoman(sequence.number)}`;
}

function addFirstChapterClass([html, job]: [Html, Job]): [Html, Job] {
  return [html.replace('<div class="sect1', '<div class="sect1 first-chapter'), job];
}

function inlineNotes([html, job]: [Html, Job]): [Html, Job] {
  const {
    spec: { notes },
  } = job;
  return [
    html.replace(
      /{% note: ([a-z0-9-]+) %}/gim,
      (_, id) => `<span class="footnote">${notes.get(id) || ''}</span>`,
    ),
    job,
  ];
}

function prependFrontmatter([html, job]: [Html, Job]): [Html, Job] {
  if (job.meta.frontmatter === false) {
    return [html, job];
  }
  return [pdfFrontmatter(job).concat(html), job];
}

function addBodyClasses([html, job]: [Html, Job]): [Html, Job] {
  const { abbrev } = getTrim(job);
  return [html.replace('<body>', `<body class="body trim--${abbrev}">`), job];
}

export function getTrim({ meta }: Job): PrintSizeDetails {
  return getBookSize(meta.printSize || 'm');
}

function wrapHtml([html, job]: [Html, Job]): [Html, Job] {
  const wrapped = stripIndent(`
    <!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `).trim();
  return [wrapped, job];
}
