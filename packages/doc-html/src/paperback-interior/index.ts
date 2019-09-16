import flow from 'lodash/flow';
import { toRoman } from 'roman-numerals';
import {
  DocPrecursor,
  Html,
  Heading,
  Lang,
  PaperbackInteriorOptions,
} from '@friends-library/types';
import { replaceHeadings } from '../headings';
import { capitalizeTitle, trimTrailingPunctuation } from '../helpers';
import { frontmatter } from './frontmatter';

export default function paperbackInteriorHtml(
  dpc: DocPrecursor,
  volumeIdx: number,
  opts: PaperbackInteriorOptions,
): Html {
  console.log('the main fn');
  return flow([joinSections, addFirstChapterClass, inlineNotes, prependFrontmatter])([
    '',
    dpc,
    opts,
  ])[0];
}

interface HtmlStep {
  (data: [Html, DocPrecursor, PaperbackInteriorOptions]): [
    Html,
    DocPrecursor,
    PaperbackInteriorOptions,
  ];
}

const joinSections: HtmlStep = ([html, dpc, opts]) => {
  console.log('join sections  s');
  const joined = dpc.sections
    .map(({ html, heading }) => {
      return replaceHeadings(html, heading, dpc).replace(
        '<div class="sectionbody">',
        `<div class="sectionbody" short="${runningHeader(heading, dpc.lang)}">`,
      );
    })
    .join('\n');
  return [joined, dpc, opts];
};

function runningHeader({ shortText, text, sequence }: Heading, lang: Lang): string {
  if (shortText || text || !sequence) {
    return capitalizeTitle(trimTrailingPunctuation(shortText || text), lang).replace(
      / \/ .+/,
      '',
    );
  }
  return `${sequence.type} ${toRoman(sequence.number)}`;
}

const addFirstChapterClass: HtmlStep = ([html, dpc, opts]) => {
  return [
    html.replace('<div class="sect1', '<div class="sect1 first-chapter'),
    dpc,
    opts,
  ];
};

const inlineNotes: HtmlStep = ([html, dpc, opts]) => {
  console.log('inline the notes');
  return [
    html.replace(
      /{% note: ([a-z0-9-]+) %}/gim,
      (_, id) => `<span class="footnote">${dpc.notes.get(id) || ''}</span>`,
    ),
    dpc,
    opts,
  ];
};

const prependFrontmatter: HtmlStep = ([html, dpc, opts]) => {
  console.log('INSIDE THE FRONTMATTER FUN');
  if (!opts.frontmatter) {
    console.log('do not add front matter');
    return [html, dpc, opts];
  }
  console.log('do add front matter');
  return [frontmatter(dpc).concat(html), dpc, opts];
};
