// @flow
import { toArabic } from 'roman-numerals';
import type { Html, DocSection } from '../type';


export function divide(html: Html): Array<DocSection> {
  const sections = html
    .split(/(?=<div (?:class="sect1"|id="footnotes")>)/gim)
    .filter(sect => !!sect.trim())
    .map(expandFootnotes)
    .map(extractTitle);
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
    /href="#_footnoteref_([0-9]+)/gim,
    (full, num) => full.replace('#', `${notes[num]}.xhtml#`)
  );

  return sections;
}

function expandFootnotes(html: Html): Html {
   return html.replace(
    /href="#_footnotedef_/gim,
    'href="notes.xhtml#_footnotedef_'
  );
}


function extractTitle(html: Html, i: number): DocSection {
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
    id: `sect${i + 1}`,
    html,
    title,
    ref,
    isChapter: true,
    isFootnotes: false,
  };

  const pattern = /(Chapter ((?:[1-9]+[0-9]*)|(?:[ivxlcdm]+)))(?::|\.)\s+([^<]+)/i;
  const titleMatch = title.match(pattern);
  if (!titleMatch) {
    return section;
  }

  const [full, prefix, number, body] = titleMatch;
  section.chapterTitlePrefix = prefix.trim();
  section.chapterNumber = Number.isNaN(+number)? toArabic(number) : +number;
  section.chapterTitleBody = body.trim();

  section.html = html.replace(
    /(<h2[^>]+?>)(.+?)<\/h2>/i,
    [
      '$1',
        '<span class="chapter-title__prefix">',
          `Chapter <span class="chapter-title__number">${section.chapterNumber || ''}</span>`,
        '</span>',
        '<span class="chapter-title__separator">:</span>',
        '<span class="chapter-title__body">',
          ` ${section.chapterTitleBody}`,
        '</span>',
      '</h2>',
    ].join(''),
  );

  return section;
}
