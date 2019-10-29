import { paperbackInterior as css } from '@friends-library/doc-css';
import flow from 'lodash/flow';
import {
  DocPrecursor,
  Html,
  FileManifest,
  PaperbackInteriorConfig,
} from '@friends-library/types';
import { getPrintSizeDetails } from '@friends-library/lulu';
import { removeMobi7Tags } from '@friends-library/doc-html';
import wrapHtmlBody from '../wrap-html';
import frontmatter from './frontmatter';
import {
  makeVolumeSplitFilter,
  lineSvgMarkup,
  joinSections,
  inlineNotes,
  HtmlStep,
} from '../pdf-shared';

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

const addFirstChapterClass: HtmlStep = ([html, dpc, conf, volIdx]) => {
  return [
    html.replace('<div class="sect1', '<div class="sect1 first-chapter'),
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
  const { abbrev } = getPrintSizeDetails(conf.printSize || 'm');
  const wrapped = wrapHtmlBody(html, {
    title: dpc.meta.title,
    css: ['doc.css'],
    bodyClass: `body trim--${abbrev}`,
  });
  return [wrapped, dpc, conf, volIdx];
};
