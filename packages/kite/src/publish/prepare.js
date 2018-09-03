// @flow
import uuid from 'uuid/v4';
import striptags from 'striptags';
import { toArabic } from 'roman-numerals';
import Asciidoctor from 'asciidoctor.js';
import { flow, memoize } from 'lodash';
import type {
  Epigraph,
  Asciidoc,
  DocSection,
  SourcePrecursor,
  SourceSpec,
  Html,
  Notes,
} from '../type';


export function prepare(precursor: SourcePrecursor): SourceSpec {
  const { epigraphs, sections, notes } = processAdoc(precursor.adoc);
  return {
    id: precursor.id,
    lang: precursor.lang,
    meta: precursor.meta,
    filename: precursor.filename,
    revision: precursor.revision,
    config: precursor.config,
    epigraphs,
    sections,
    notes,
  };
}

function processAdoc(
  adoc: Asciidoc,
): {
  epigraphs: Array<Epigraph>,
  sections: Array<DocSection>,
  notes: Notes,
} {
  const shortHeadings = extractShortHeadings(adoc);
  const [epigraphs, adocSansEpigraphs] = extractEpigraphs(adoc);
  const completeHtml = adocToHtml(adocSansEpigraphs);
  const [notes, htmlSansNotes] = extractNotes(completeHtml);
  return {
    notes,
    epigraphs,
    sections: htmlToSections(htmlSansNotes, shortHeadings),
  };
}

function extractShortHeadings(adoc: Asciidoc): Map<string, string> {
  const headings = new Map();
  const regex = /\[#([a-z0-9-_]+)(?:\.[a-z0-9-_]+?)?,.*?short="(.*?)"\]\n== /gim;
  let match;
  while ((match = regex.exec(adoc))) {
    const [_, ref, short] = match;
    headings.set(ref, short);
  }
  return headings;
}

function htmlToSections(docHtml: Html, shortHeadings: Map<string, string>): Array<DocSection> {
  return docHtml
    .split(/(?=<div class="sect1[^>]+?>)/gim)
    .filter(html => !!html.trim())
    .map((html: Html, i: number) => ({ index: i, id: `section${i + 1}`, html }))
    .map(section => extractHeading(section, shortHeadings));
}

function extractHeading(section: Object, short: Map<string, string>) {
  section.html = section.html.replace(
    /(<div class="sect1(?: style-([a-z]+))?">\n)<h2 id="([^"]+)"[^>]*?>(.+?)<\/h2>/,
    (_, start, style, id, inner) => {
      section.heading = {
        id,
        ...parseHeading(inner),
        ...short.has(id) ? { shortText: short.get(id) } : {},
      };

      const sectionStart = start.replace(/ style-[a-z]+/, '');
      return `${sectionStart}{% chapter-heading${style ? `, ${style}` : ''} %}`;
    },
  );

  return section;
}

function parseHeading(text: string): Object {
  const pattern = /(chapter|section) ((?:[1-9]+[0-9]*)|(?:[ivxlcdm]+))(?::|\.)?(?:\s+([^<]+))?/i;
  const match = text.match(pattern);

  if (!match) {
    return { text: text.trim() };
  }

  const [_, type, number, body] = match;
  return {
    text: (body || '').trim(),
    sequence: {
      type: type.toLowerCase(),
      number: Number.isNaN(+number) ? toArabic(number) : +number,
    },
  };
}

const asciidoctor = new Asciidoctor();

const adocToHtml: (adoc: Asciidoc) => Html = memoize(flow([
  replaceAsterisms,
  changeChapterSynopsisMarkup,
  adoc => adoc.replace(/"`/igm, '&#8220;'),
  adoc => adoc.replace(/`"/igm, '&#8221;'),
  adoc => adoc.replace(/'`/igm, '&#8216;'),
  adoc => adoc.replace(/`'/igm, '&#8217;'),
  adoc => adoc.replace(/--/igm, '&#8212;'),
  adoc => adoc.replace(/&#8212;\n([a-z]|&#8220;|&#8216;)/gm, '&#8212;$1'),
  adoc => adoc.replace(/\^\nfootnote:\[/igm, 'footnote:['),
  adoc => asciidoctor.convert(adoc),
  changeVerseMarkup,
  html => html.replace(/<hr>/igm, '<hr />'),
  html => html.replace(/<br>/igm, '<br />'),
  html => html.replace(/class="paragraph salutation"/gim, 'class="salutation"'),
  html => html.replace(/class="paragraph signed-section-/gim, 'class="signed-section-'),
]));

function changeVerseMarkup(html: Html): Html {
  return html.replace(
    /<div class="verseblock">\n<pre class="content">([\s\S]*?)<\/pre>\n<\/div>/gim,
    (_, verses) => (verses
      .trim()
      .split('\n')
      .map(v => `<div class="verse__line">${v}</div>`)
      .reduce((els, el) => els.concat([el]), ['<div class="verse">'])
      .concat(['</div>'])
      .join('\n')
    ),
  );
}

function changeChapterSynopsisMarkup(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[\.chapter-synopsis\]\n([\s\S]+?)(?=\n\n)/gim,
    (_, inner) => {
      const joined = inner
        .trim()
        .split('\n')
        .map(line => line.trim())
        .map(line => line.replace(/^\* /, ''))
        .join('&#8212;');
      return `++++\n<p class="chapter-synopsis">${joined}</p>\n++++`;
    },
  );
}

function replaceAsterisms(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[\.asterism\]\n'''/igm,
    '++++\n<div class="asterism">*&#160;&#160;*&#160;&#160;*</div>\n++++',
  );
}

function extractNotes(srcHtml: Html): [Notes, Html] {
  const map = new Map();
  let html = srcHtml.replace(
    /<sup class="footnote">\[<a id="_footnoteref_([0-9]+)"[\s\S]+?<\/sup>/igm,
    (_, num) => {
      const id = uuid();
      map.set(num, id);
      return `{% note: ${id} %}`;
    },
  );

  const notes = new Map();
  html = html.replace(
    /<div class="footnote" id="_footnotedef_([0-9]+)[\S\s]+?<\/div>/igm,
    (full, num) => {
      const note = striptags(full, ['em', 'i', 'strong', 'b'])
        .trim()
        .replace(/^[0-9]+\. /, '');
      notes.set(map.get(num) || '', note);
      return '';
    },
  );

  html = html.replace(/<div id="footnotes"[\s\S]+?<\/div>/igm, '');

  return [notes, html];
}

function extractEpigraphs(adoc: Asciidoc): [Array<Epigraph>, Asciidoc] {
  const epigraphs = [];
  const shortened = adoc.replace(
    /\[quote\.epigraph(?:, *, *([^\]]+?))?\]\n____+\n([\s\S]+?)\n____+/gim,
    (_, source, text) => {
      epigraphs.push({ text, ...source ? { source } : {} });
      return '';
    },
  );
  return [epigraphs, shortened];
}
