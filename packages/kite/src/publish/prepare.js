// @flow
import uuid from 'uuid/v4';
import striptags from 'striptags';
import { toArabic } from 'roman-numerals';
import { flow, memoize } from 'lodash';
import { wrapper } from './text';
import { br7 } from './html';
import { transformAsciidoc } from './transform-asciidoc';
import { transformHtml } from './transform-html';
import { convertAsciidoc } from './convert-asciidoc';
import type { Asciidoc, Html } from '../../../../type';
import type {
  Epigraph,
  DocSection,
  SourcePrecursor,
  SourceSpec,
  Notes,
} from '../type';


export function prepare(precursor: SourcePrecursor): SourceSpec {
  const { epigraphs, sections, notes } = processAdoc(precursor.adoc);
  return {
    id: precursor.id,
    size: precursor.adoc.length,
    lang: precursor.lang,
    meta: precursor.meta,
    filename: precursor.filename,
    revision: precursor.revision,
    config: precursor.config,
    customCss: precursor.customCss,
    epigraphs,
    sections,
    notes,
  };
}

function processAdoc(adoc: Asciidoc): {
  epigraphs: Array<Epigraph>,
  sections: Array<DocSection>,
  notes: Notes,
} {
  const shortHeadings = extractShortHeadings(adoc);
  const [epigraphs, adocSansEpigraphs] = extractEpigraphs(adoc);
  const completeHtml = adocToHtml(adocSansEpigraphs);
  const [notes, htmlSansNotes] = extractNotes(completeHtml);
  verifyHtml(htmlSansNotes);
  return {
    notes,
    epigraphs,
    sections: htmlToSections(htmlSansNotes, shortHeadings),
  };
}

function verifyHtml(html: Html): void {
  if (html.match(/>==+ /gm)) {
    throw new Error('Html error: unresolved heading asciidoc');
  }
  if (html.match(/<p>&#8212;<\/p>/gm)) {
    throw new Error('Html error: unresolved open block delimiter');
  }
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
    .map(addSignedSectionClass)
    .map((html: Html, i: number) => ({ index: i, id: `section${i + 1}`, html }))
    .map(section => extractHeading(section, shortHeadings));
}

function addSignedSectionClass(html: Html): Html {
  const has = html.match(/class="(signed-section|salutation|letter-heading)/gm) ? 'has' : 'no';
  return html.replace(/^<div class="sect1/, `<div class="sect1 chapter--${has}-signed-section`);
}

function extractHeading(section: Object, short: Map<string, string>) {
  section.html = section.html.replace(
    /(<div class="sect1([^"]+?)?">\n)<h2 id="([^"]+)"[^>]*?>(.+?)<\/h2>/,
    (_, start, kls, id, inner) => {
      section.heading = {
        id,
        ...parseHeading(inner),
        ...short.has(id) ? { shortText: short.get(id) } : {},
      };

      const match = kls.match(/ style-([a-z]+)/);
      const sectionStart = start.replace(/ style-[a-z]+/, '');
      return `${sectionStart}{% chapter-heading${match ? `, ${match[1]}` : ''} %}`;
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
      type: type.toLowerCase() === 'section' ? 'Section' : 'Chapter',
      number: Number.isNaN(+number) ? toArabic(number) : +number,
    },
  };
}

const adocToHtml: (adoc: Asciidoc) => Html = memoize(flow([
  transformAsciidoc,
  convertAsciidoc,
  transformHtml,
]));

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
        .replace(/{footnote-paragraph-split}/g, `<span class="fn-split">${br7}${br7}</span>`)
        .replace(/^[0-9]+\. /, '');
      notes.set(map.get(num) || '', expandFootnotePoetry(note));
      return '';
    },
  );

  html = html.replace(/<div id="footnotes"[\s\S]+?<\/div>/igm, '');

  return [notes, html];
}

function expandFootnotePoetry(html: Html): Html {
  const nowrap = wrapper('', '');
  return html.replace(
    / ` {4}(.+?) *?`( )?/gim,
    (_, poem) => {
      let stanzas = false;
      return poem
        .split('      ')
        .map(line => {
          if (line.match(/^- - -/)) {
            stanzas = true;
            return '</span>\n<span class="verse__stanza">';
          }
          const spacer = '&#160;&#160;&#160;&#160;';
          line = line.replace(/^ +/, s => s.split().map(() => spacer).join(''));
          return `<span class="verse__line">${br7}${line}</span>`;
        })
        .reduce(stanzas ? wrapper('<span class="verse__stanza">', '</span>') : nowrap, [])
        .reduce(wrapper(`<span class="verse">${br7}`, '</span>'), [])
        .join('\n');
    },
  );
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
