import { toRoman } from 'roman-numerals';
import {
  DocPrecursor,
  Html,
  Heading,
  Lang,
  Xml,
  PrintSize,
} from '@friends-library/types';
import {
  replaceHeadings,
  capitalizeTitle,
  trimTrailingPunctuation,
} from '@friends-library/doc-html';

export interface HtmlStepConfig {
  printSize?: PrintSize;
  frontmatter: boolean;
  condense: boolean;
  allowSplits: boolean;
}

export interface HtmlStep {
  (data: [Html, DocPrecursor, HtmlStepConfig, number?]): [
    Html,
    DocPrecursor,
    HtmlStepConfig,
    number?,
  ];
}

export const joinSections: HtmlStep = ([, dpc, conf, volIdx]) => {
  const joined = dpc.sections
    .filter(makeVolumeSplitFilter(dpc, volIdx))
    .map(({ html, heading }) => {
      return replaceHeadings(html, heading, dpc).replace(
        `<div class="sectionbody">`,
        `<div class="sectionbody" short="${runningHeader(heading, dpc.lang)}">`,
      );
    })
    .join(`\n`);
  return [joined, dpc, conf, volIdx];
};

export function makeVolumeSplitFilter(
  dpc: DocPrecursor,
  volIdx?: number,
): (_: any, sectionIndex: number) => boolean {
  return (_, sectionIndex) => {
    if (typeof volIdx !== `number`) return true;
    const start = (dpc.paperbackSplits[volIdx - 1] || 0) - 1;
    const stop = dpc.paperbackSplits[volIdx] || Infinity;
    return sectionIndex > start && sectionIndex < stop;
  };
}

function runningHeader({ shortText, text, sequence }: Heading, lang: Lang): string {
  if (shortText || text || !sequence) {
    return capitalizeTitle(trimTrailingPunctuation(shortText || text), lang).replace(
      / \/ .+/,
      ``,
    );
  }
  return `${sequence.type} ${toRoman(sequence.number)}`;
}

export const inlineNotes: HtmlStep = ([html, dpc, conf, volIdx]) => {
  return [
    html.replace(
      /{% note: ([a-z0-9-]+) %}/gim,
      (_, id) => `<span class="footnote">${dpc.notes.get(id) || ``}</span>`,
    ),
    dpc,
    conf,
    volIdx,
  ];
};

export function lineSvgMarkup(): Xml {
  return `<svg height="1px" width="88px" version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="88" y2="0" style="stroke:rgb(0,0,0);stroke-width:1" /></svg>`;
}
