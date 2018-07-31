// @flow
import { toArabic, toRoman } from 'roman-numerals';
import { get } from 'lodash';
import type { Html, DocSection } from '../type';


export function divide(html: Html, config: Object = {}): Array<DocSection> {
  const sections = html
    .split(/(?=<div (?:class="sect1"|id="footnotes")>)/gim)
    .filter(sect => !!sect.trim())
    .map(expandFootnotes)
    .map(removeFootnoteBraces)
    .map((html: Html, i: number) => extractTitle(html, i + 1, config));
  return linkFootnotes(sections);
}


function linkFootnotes(sections: Array<DocSection>): Array<DocSection> {
  const last = sections.slice(-1).pop();
  if (last.id !== 'notes') {
    return sections; // no footnotes
  }

  const notes = sections.reduce((acc, { html, id }) => {
    const regex = /notes\.xhtml#_footnotedef_([0-9]+)/g;
    let match;
    while (match = regex.exec(html)) {
      acc[match[1]] = id;
    }
    return acc;
  }, {});

  last.html = last.html.replace(
    /href="#_footnoteref_([0-9]+)">\d+<\/a>\./gim,
    (full, num) => `href="${notes[num]}.xhtml#_footnoteref_${num}">${num}</a>`
  );

  return sections;
}

function expandFootnotes(html: Html): Html {
  return html.replace(
    /href="#_footnotedef_/gim,
    'href="notes.xhtml#_footnotedef_'
  );
}

function removeFootnoteBraces(html: Html): Html {
  return html.replace(
    /<sup class="footnote">\[<a/gim,
    '<sup class="footnote"><a'
  ).replace(
    /<\/a>\]<\/sup>/gim,
    '</a></sup>'
  );
}


function extractTitle(html: Html, num: number, config: Object): DocSection {
  const headingMatch = html.match(/<h2 id="([^"]+)"[^>]*?>(.+?)<\/h2>/)
  if (!headingMatch) {
    return {
      html,
      id: 'notes',
      isChapter: false,
      isFootnotes: true,
    };
  }

  const ref = headingMatch[1];
  const title = headingMatch[2].trim();

  const section: DocSection = {
    id: `sect${num}`,
    html,
    title,
    ref,
    chapterTitleShort: get(config, ['shortTitles', ref]),
    isChapter: true,
    isFootnotes: false,
  };

  const pattern = /(Chapter ((?:[1-9]+[0-9]*)|(?:[ivxlcdm]+)))(?::|\.)?(?:\s+([^<]+))?/i;
  const titleMatch = title.match(pattern);
  if (!titleMatch) {
    return section;
  }

  const [full, prefix, number, body] = titleMatch;
  section.chapterTitlePrefix = prefix.trim();
  section.chapterNumber = Number.isNaN(+number)? toArabic(number) : +number;
  section.chapterTitleBody = body ? body.trim() : '';

  const separator = get(config, 'chapterTitleSeparator', ':');
  let displayNumber = section.chapterNumber || '';
  if (get(config, 'chapterNumberFormat') === 'roman') {
    displayNumber = toRoman(section.chapterNumber).toUpperCase();
  }

  section.html = html.replace(
    /(<h2[^>]+?>)(.+?)<\/h2>/i,
    [
      '$1',
        '<span class="chapter-title__prefix">',
          `Chapter <span class="chapter-title__number">${displayNumber}</span>`,
        '</span>',
        body ? `<span class="chapter-title__separator">${separator}</span>` : '',
        body ? '<span class="chapter-title__body">' : '',
          body ? ` ${section.chapterTitleBody || ''}` : '',
        body ? '</span>' : '',
      '</h2>',
    ].join(''),
  );

  return section;
}
