// @flow
import { toArabic, toRoman } from 'roman-numerals';
import { get } from 'lodash';
import type { Html, DocSection, Asciidoc } from '../type';
import { M7BR } from '../epub';


export function divide(html: Html, config: Object, adoc: Asciidoc = ''): Array<DocSection> {
  const sections = html
    .split(/(?=<div (?:class="sect1"|id="footnotes")>)/gim)
    .filter(sect => !!sect.trim())
    .map(expandFootnotes)
    .map(removeFootnoteBraces)
    .map((sectionHtml: Html, i: number) => extractTitle(sectionHtml, i + 1, config));
  return linkFootnotes(extractShortTitles(sections, adoc));
}

function extractShortTitles(sections: Array<DocSection>, adoc: Asciidoc): Array<DocSection> {
  const regex = /\[#([a-z0-9-_]+),.*?short="(.*?)"\]\n== /gim;
  let match;
  while ((match = regex.exec(adoc))) {
    const [_, ref, short] = match;
    const found = sections.find(section => section.ref === ref);
    if (found) {
      found.chapterTitleShort = short;
    }
  }
  return sections;
}

function linkFootnotes(sections: Array<DocSection>): Array<DocSection> {
  const last = sections.slice(-1).pop();
  if (!last || last.id !== 'notes') {
    return sections; // no footnotes
  }

  const notes = sections.reduce((acc, { html, id }) => {
    const regex = /notes\.xhtml#_footnotedef_([0-9]+)/g;
    let match;
    while (match = regex.exec(html)) {
      acc[match[1]] = id;
    }
    return acc;
  }, { '1': 'footnote-helper' }); // eslint-disable-line quote-props

  last.html = last.html.replace(
    /href="#_footnoteref_([0-9]+)">\d+<\/a>\./gim,
    (full, num) => `href="${notes[num]}.xhtml#_footnoteref_${num}">${num}</a>`,
  );

  last.html = addFootnoteBackArrows(last.html);

  return sections;
}

function addFootnoteBackArrows(html: Html): Html {
  return html.replace(
    /(?<=<a href="([^"]+?)">[0-9]+?<\/a>[\S\s]*?)(?=<\/div>\s*(<div class="footnote"|<\/div>))/gim,
    ` <a href="$1">\u23CE</a>${M7BR}${M7BR}`,
  );
}

function expandFootnotes(html: Html): Html {
  return html.replace(
    /href="#_footnotedef_/gim,
    'href="notes.xhtml#_footnotedef_',
  );
}

function removeFootnoteBraces(html: Html): Html {
  return html.replace(
    /<sup class="footnote">\[<a/gim,
    '<sup class="footnote"><a',
  ).replace(
    /<\/a>\]<\/sup>/gim,
    '</a></sup>',
  );
}


function extractTitle(html: Html, num: number, config: Object): DocSection {
  const headingMatch = html.match(/<h2 id="([^"]+)"[^>]*?>(.+?)<\/h2>/);
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
    isChapter: true,
    isFootnotes: false,
  };

  const pattern = /(Chapter ((?:[1-9]+[0-9]*)|(?:[ivxlcdm]+)))(?::|\.)?(?:\s+([^<]+))?/i;
  const titleMatch = title.match(pattern);
  if (!titleMatch) {
    section.html = section.html.replace(/<\/h2>/, `</h2>${M7BR}`);
    return section;
  }

  const [_, prefix, number, body] = titleMatch;
  section.chapterTitlePrefix = prefix.trim();
  section.chapterNumber = Number.isNaN(+number) ? toArabic(number) : +number;
  section.chapterTitleBody = body ? body.trim() : '';

  const separator = get(config, 'chapterTitleSeparator', ':');
  let displayNumber = section.chapterNumber || '';
  if (get(config, 'chapterNumberFormat') === 'roman') {
    displayNumber = toRoman(section.chapterNumber).toUpperCase();
  }

  // @TODO mixing data and view concerns here bigtime
  section.html = html.replace(
    /<h2([^>]+?)>(.+?)<\/h2>/i,
    [
      '<header$1>',
      '<h2 class="chapter-title__prefix">',
      `Chapter <span class="chapter-title__number">${displayNumber}</span>`,
      `</h2>${M7BR}`,
      body ? '<div>' : M7BR,
      body ? `<span class="chapter-title__separator">${separator}</span>` : '',
      body ? '<span class="chapter-title__body">' : '',
      body ? ` ${section.chapterTitleBody || ''}`.toUpperCase() : '',
      body ? '</span>' : '',
      body ? `</div>${M7BR}` : '',
      '</header>',
    ].join(''),
  );

  return section;
}
