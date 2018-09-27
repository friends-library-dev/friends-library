// @flow
import uuid from 'uuid/v4';
import striptags from 'striptags';
import { toArabic } from 'roman-numerals';
import Asciidoctor from 'asciidoctor.js';
import { flow, memoize, intersection } from 'lodash';
import { wrapper } from './text';
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
    .map(addSignedSectionClass)
    .map((html: Html, i: number) => ({ index: i, id: `section${i + 1}`, html }))
    .map(section => extractHeading(section, shortHeadings));
}

function addSignedSectionClass(html: Html): Html {
  const has = html.match(/\n\[\.(signed-section|salutation|letter-heading)/gm) ? 'has' : 'no';
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

const asciidoctor = new Asciidoctor();
const br7 = '<br class="m7"/>';
const raw = (input: string): Asciidoc => `++++\n${input}\n++++`;

const adocToHtml: (adoc: Asciidoc) => Html = memoize(flow([
  replaceAsterisms,
  changeChapterSynopsisMarkup,
  changeChapterSubtitleBlurbMarkup,
  prepareDiscourseParts,
  discreteize,
  adoc => adoc.replace(/[–|—]/g, '--'),
  adoc => adoc.replace(/"`/igm, '&#8220;'),
  adoc => adoc.replace(/`"/igm, '&#8221;'),
  adoc => adoc.replace(/'`/igm, '&#8216;'),
  adoc => adoc.replace(/`'/igm, '&#8217;'),
  adoc => adoc.replace(/(?<!class="[a-z- ]+)--/gm, '&#8212;'),
  adoc => adoc.replace(/&#8212;\n([a-z]|&#8220;|&#8216;)/gm, '&#8212;$1'),
  adoc => adoc.replace(/ &#8220;\n([a-z])/gim, ' &#8220;$1'),
  adoc => adoc.replace(/&#8212;(?:\n)?_([^_]+?)_(?=[^_])/gm, '&#8212;__$1__'),
  adoc => adoc.replace(/\^\nfootnote:\[/igm, 'footnote:['),
  adoc => adoc.replace(/\[\.small-break\]\n'''/gm, raw(`<div class="small-break">${br7}</div>`)),
  adoc => asciidoctor.convert(adoc),
  changeVerseMarkup,
  modifyOldStyleHeadings,
  html => html.replace(/<hr>/igm, '<hr />'),
  html => html.replace(/<br>/igm, '<br />'),
  removeParagraphClass,
  html => html.replace(/(?<=<div class="offset">\n)([\s\S]*?)(?=<\/div>)/gim, `${br7}$1${br7}`),
  html => html.replace(/<div class="discourse-part">/gm, `<div class="discourse-part">${br7}`),
]));

function discreteize(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[((?:\.blurb|\.alt|\.centered)+)\]\n(====?) /gm,
    '[discrete$1]\n$2 ',
  );
}

function modifyOldStyleHeadings(html: Html): Html {
  return html.replace(
    /<div class="sect2 old-style( [^"]+?)?">\n<h3 ([^>]+?)>([\s\S]+?)<\/h3>/igm,
    (_, kls, h3id, text) => {
      const inner = text.split(' / ').map((part, index, parts) => {
        if (index === 0) {
          return `<span>${part} <br class="m7"/></span>`;
        }
        if (index === parts.length - 1) {
          return `<span><em>${part}</em></span>`;
        }
        return `<span><em>${part}</em> <br class="m7"/></span>`;
      }).join('');
      return `<div class="sect2"><h3 ${h3id} class="old-style${kls || ''}">${inner}</h3>`;
    },
  );
}

function removeParagraphClass(html: Html): Html {
  const standalone = [
    'salutation',
    'discourse-part',
    'offset',
    'numbered',
    'the-end',
    'letter-participants',
    'signed-section-signature',
    'signed-section-closing',
    'signed-section-context-open',
    'signed-section-context-close',
  ];

  return html.replace(
    /<div class="paragraph ([a-z0-9- ]+?)">/g,
    (full, extra) => {
      const classes = extra.split(' ');
      if (intersection(standalone, classes).length) {
        return `<div class="${extra}">`;
      }
      return full;
    },
  );
}

function changeVerseMarkup(html: Html): Html {
  return html.replace(
    /<div class="verseblock">\n<pre class="content">([\s\S]*?)<\/pre>\n<\/div>/gim,
    (_, verses) => {
      const hasStanzas = verses.match(/\n\n/gm);
      const stanzaOpen = hasStanzas ? '\n<div class="verse__stanza">' : '';
      const stanzaClose = hasStanzas ? '</div>\n' : '';
      return verses
        .trim()
        .split('\n')
        .map(v => (v ? `<div class="verse__line">${v}</div>` : `${stanzaClose}${stanzaOpen}`))
        .reduce(wrapper(`<div class="verse">${stanzaOpen}`, `${stanzaClose}</div>`), [])
        .join('\n');
    },
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
      return raw(`<p class="chapter-synopsis">${joined}</p>`);
    },
  );
}

function changeChapterSubtitleBlurbMarkup(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[\.chapter-subtitle--blurb\]\n([\s\S]+?)(?=\n\n)/gim,
    (_, inner) => {
      const joined = inner
        .trim()
        .split('\n')
        .join(' ');
      return raw(`<h3 class="chapter-subtitle--blurb">${joined}</h3>`);
    },
  );
}

function prepareDiscourseParts(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /(?<=\[\.discourse-part\]\n)(Question:|Answer(?: [0-9]+)?:|Objection:|Inquiry [0-9]+:)( |\n)/gim,
    '_$1_$2',
  );
}

function replaceAsterisms(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[\.asterism\]\n'''/igm,
    raw('<div class="asterism">*&#160;&#160;*&#160;&#160;*</div>'),
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
          return `<span class="verse__line">${line}</span>`;
        })
        .reduce(stanzas ? wrapper('<span class="verse__stanza">', '</span>') : nowrap, [])
        .reduce(wrapper('<span class="verse">', '</span>'), [])
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
