import { paperbackInterior as css } from '@friends-library/doc-css';
import flow from 'lodash/flow';
import { toRoman } from 'roman-numerals';
import {
  DocPrecursor,
  Html,
  Heading,
  Lang,
  FileManifest,
  PaperbackInteriorConfig,
  Xml,
} from '@friends-library/types';
import { getPrintSizeDetails } from '@friends-library/lulu';
import {
  replaceHeadings,
  capitalizeTitle,
  trimTrailingPunctuation,
  removeMobi7Tags,
} from '@friends-library/doc-html';
import wrapHtmlBody from '../wrap-html';
import frontmatter from './frontmatter';

export default async function paperbackInteriorManifests(
  dpc: DocPrecursor,
  conf: PaperbackInteriorConfig,
): Promise<FileManifest[]> {
  const docCss = css(dpc, conf);
  if (conf.allowSplits === false || dpc.paperbackSplits.length === 0) {
    return [
      {
        'doc.html': html(dpc, conf),
        'doc.css': docCss,
        'line.svg': lineSvgMarkup(),
      },
    ];
  }

  return [...dpc.paperbackSplits, Infinity].map((split, volIdx) => {
    return {
      'doc.html': html(dpc, conf, volIdx),
      'doc.css': docCss,
      'line.svg': lineSvgMarkup(),
    };
  });
}

function html(dpc: DocPrecursor, conf: PaperbackInteriorConfig, volIdx?: number): Html {
  return flow([
    joinSections,
    addFirstChapterClass,
    inlineNotes,
    prependFrontmatter,
    ([html, d, c, i]) => [removeMobi7Tags(html), d, c, i],
    wrapHtml,
  ])(['', dpc, conf, volIdx])[0];
}

interface HtmlStep {
  (data: [Html, DocPrecursor, PaperbackInteriorConfig, number?]): [
    Html,
    DocPrecursor,
    PaperbackInteriorConfig,
    number?,
  ];
}

const joinSections: HtmlStep = ([, dpc, conf, volIdx]) => {
  const joined = dpc.sections
    .filter(makeVolumeSplitFilter(dpc, volIdx))
    .map(({ html, heading }) => {
      return replaceHeadings(html, heading, dpc).replace(
        '<div class="sectionbody">',
        `<div class="sectionbody" short="${runningHeader(heading, dpc.lang)}">`,
      );
    })
    .join('\n');
  return [joined, dpc, conf, volIdx];
};

function makeVolumeSplitFilter(
  dpc: DocPrecursor,
  volIdx?: number,
): (_: any, sectionIndex: number) => boolean {
  return (_, sectionIndex) => {
    if (typeof volIdx !== 'number') return true;
    const start = (dpc.paperbackSplits[volIdx - 1] || 0) - 1;
    const stop = dpc.paperbackSplits[volIdx] || Infinity;
    return sectionIndex > start && sectionIndex < stop;
  };
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

const addFirstChapterClass: HtmlStep = ([html, dpc, conf, volIdx]) => {
  return [
    html.replace('<div class="sect1', '<div class="sect1 first-chapter'),
    dpc,
    conf,
    volIdx,
  ];
};

const inlineNotes: HtmlStep = ([html, dpc, conf, volIdx]) => {
  return [
    html.replace(
      /{% note: ([a-z0-9-]+) %}/gim,
      (_, id) => `<span class="footnote">${dpc.notes.get(id) || ''}</span>`,
    ),
    dpc,
    conf,
    volIdx,
  ];
};

const prependFrontmatter: HtmlStep = ([html, dpc, conf, volIdx]) => {
  if (!conf.frontmatter) {
    return [html, dpc, conf, volIdx];
  }

  const splitDpc = {
    ...dpc,
    sections: dpc.sections.filter(makeVolumeSplitFilter(dpc, volIdx)),
  };

  return [frontmatter(splitDpc, volIdx).concat(html), dpc, conf, volIdx];
};

const wrapHtml: HtmlStep = ([html, dpc, conf, volIdx]) => {
  const { abbrev } = getPrintSizeDetails(conf.printSize);
  const wrapped = wrapHtmlBody(html, {
    title: dpc.meta.title,
    css: ['doc.css'],
    bodyClass: `body trim--${abbrev}`,
  });
  return [wrapped, dpc, conf, volIdx];
};

function lineSvgMarkup(): Xml {
  return '<svg height="1px" width="88px" version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="88" y2="0" style="stroke:rgb(0,0,0);stroke-width:1" /></svg>';
}
