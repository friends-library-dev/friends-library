import flow from 'lodash/flow';
import {
  DocPrecursor,
  Html,
  Heading,
  Lang,
  PaperbackInteriorOptions as Options,
} from '@friends-library/types';
import { replaceHeadings } from './headings';
import { capitalizeTitle, trimTrailingPunctuation } from './helpers';
import { toRoman } from 'roman-numerals';

export default function paperbackInteriorHtml(
  dpc: DocPrecursor,
  volumeIdx: number,
  opts: Options,
): Html {
  return flow([joinSections, addFirstChapterClass, inlineNotes])(['', dpc, opts])[0];
}

function joinSections([, dpc]: [Html, DocPrecursor, Options]): [
  Html,
  DocPrecursor,
  Options,
] {
  const joined = dpc.sections
    .map(({ html, heading }) => {
      return replaceHeadings(html, heading, dpc).replace(
        '<div class="sectionbody">',
        `<div class="sectionbody" short="${runningHeader(heading, dpc.lang)}">`,
      );
    })
    .join('\n');
  return [joined, dpc];
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

function addFirstChapterClass([html, dpc]: [Html, DocPrecursor, Options]): [
  Html,
  DocPrecursor,
  Options,
] {
  return [html.replace('<div class="sect1', '<div class="sect1 first-chapter'), dpc];
}

function inlineNotes([html, dpc]: [Html, DocPrecursor, Options]): [
  Html,
  DocPrecursor,
  Options,
] {
  return [
    html.replace(
      /{% note: ([a-z0-9-]+) %}/gim,
      (_, id) => `<span class="footnote">${dpc.notes.get(id) || ''}</span>`,
    ),
    dpc,
  ];
}
