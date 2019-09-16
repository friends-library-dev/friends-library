import flow from 'lodash/flow';
import { toRoman } from 'roman-numerals';
import {
  DocPrecursor,
  Html,
  Heading,
  Lang,
  PaperbackInteriorConfig,
} from '@friends-library/types';
import { getPrintSizeDetails } from '@friends-library/lulu';
import { replaceHeadings } from '../headings';
import {
  capitalizeTitle,
  trimTrailingPunctuation,
  removeMobi7Tags,
  wrapHtmlBody,
} from '../helpers';
import { frontmatter } from './frontmatter';

export default function paperbackInteriorHtml(
  dpc: DocPrecursor,
  volumeIdx: number,
  conf: PaperbackInteriorConfig,
): Html {
  return flow([
    joinSections,
    addFirstChapterClass,
    inlineNotes,
    prependFrontmatter,
    ([html, d, c]) => [removeMobi7Tags(html), d, c],
    wrapHtml,
  ])(['', dpc, conf])[0];
}

interface HtmlStep {
  (data: [Html, DocPrecursor, PaperbackInteriorConfig]): [
    Html,
    DocPrecursor,
    PaperbackInteriorConfig,
  ];
}

const joinSections: HtmlStep = ([html, dpc, conf]) => {
  const joined = dpc.sections
    .map(({ html, heading }) => {
      return replaceHeadings(html, heading, dpc).replace(
        '<div class="sectionbody">',
        `<div class="sectionbody" short="${runningHeader(heading, dpc.lang)}">`,
      );
    })
    .join('\n');
  return [joined, dpc, conf];
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

const addFirstChapterClass: HtmlStep = ([html, dpc, conf]) => {
  return [
    html.replace('<div class="sect1', '<div class="sect1 first-chapter'),
    dpc,
    conf,
  ];
};

const inlineNotes: HtmlStep = ([html, dpc, conf]) => {
  return [
    html.replace(
      /{% note: ([a-z0-9-]+) %}/gim,
      (_, id) => `<span class="footnote">${dpc.notes.get(id) || ''}</span>`,
    ),
    dpc,
    conf,
  ];
};

const prependFrontmatter: HtmlStep = ([html, dpc, conf]) => {
  if (!conf.frontmatter) {
    return [html, dpc, conf];
  }
  return [frontmatter(dpc).concat(html), dpc, conf];
};

const wrapHtml: HtmlStep = ([html, dpc, conf]) => {
  const { abbrev } = getPrintSizeDetails(conf.printSize);
  const wrapped = wrapHtmlBody(html, {
    title: dpc.meta.title,
    css: ['doc.css'],
    bodyClass: `body trim--${abbrev}`,
  });
  return [wrapped, dpc, conf];
};
