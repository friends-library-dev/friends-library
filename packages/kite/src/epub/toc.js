// @flow
import { toRoman } from 'roman-numerals';
import type { SourceSpec, DocSection, Html } from '../type';
import { wrapHtml } from './';
import {M7BR} from './index';

export function toc({ sections, config, target }: SourceSpec): Html {
  return wrapHtml(`
<nav epub:type="toc" id="toc">
  <h2>Table of Contents</h2>
  <ol class="table-of-contents">
    <li hidden=""><a href="half-title.xhtml">Title</a></li>
    ${sections.filter(s => s.id !== 'notes').map(sect =>
      `<li><a href="${sect.id}.xhtml">${entryText(sect, config)}</a></li>`
    ).join('\n      ')}
  </ol>
</nav>
<nav epub:type="landmarks" hidden="">
  <ol>
    <li><a href="half-title.xhtml" epub:type="titlepage">Title page</a></li>
    ${target == 'mobi' ? '<li><a href="nav.xhtml" epub:type="toc">Table of Contents</a></li>' : ''}
    <li><a href="half-title.xhtml" epub:type="bodymatter">Beginning</a></li>
  </ol>
</nav>
  `.trim());
}

export function contentToc({ sections, config }: SourceSpec): Html {
  return wrapHtml(`
<section class="content-toc">
  <h1>Table of Contents</h1>
  ${sections.filter(s => s.id !== 'notes').map(sect =>
    `<div>${M7BR}<a href="${sect.id}.xhtml">${entryText(sect, config)}</a>${M7BR}</div>`
  ).join(`\n      `)}
</section>
  `.trim());
}


export function entryText(section: DocSection, config: Object): string {
  if (!section.chapterNumber) {
    return section.chapterTitleShort || section.title || '';
  }

  let displayNumber = section.chapterNumber;
  if (config.chapterNumberFormat === 'roman') {
    displayNumber = toRoman(section.chapterNumber).toUpperCase();
  }

  let text = `Chapter ${displayNumber}`;
  if (section.chapterTitleShort) {
    text+= ` — ${section.chapterTitleShort}`;
  } else if (section.chapterTitleBody) {
    text+= ` — ${section.chapterTitleBody}`;
  }

  return text;
}
