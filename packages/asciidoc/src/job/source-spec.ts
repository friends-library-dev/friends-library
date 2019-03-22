import {
  SourcePrecursor,
  SourceSpec,
  Asciidoc,
  Epigraph,
  DocSection,
  Notes,
  Html,
  Omit,
  AsciidocConversionLog,
} from '@friends-library/types';
import { extractShortHeadings } from './headings';
import { extractEpigraphs } from './epigraphs';
import adocToHtml from './adoc-to-html';
import { extractNotes } from './notes';
import { toArabic } from 'roman-numerals';

export default function createSourceSpec(precursor: SourcePrecursor): SourceSpec {
  const { epigraphs, sections, notes, logs } = processAdoc(precursor.adoc);
  return {
    id: precursor.id,
    size: precursor.adoc.length,
    lang: precursor.lang,
    meta: precursor.meta,
    filename: precursor.filename,
    revision: precursor.revision,
    config: precursor.config,
    customCss: precursor.customCss,
    conversionLogs: logs,
    epigraphs,
    sections,
    notes,
  };
}

function processAdoc(
  adoc: Asciidoc,
): {
  epigraphs: Epigraph[];
  sections: DocSection[];
  notes: Notes;
  logs: AsciidocConversionLog[];
} {
  const shortHeadings = extractShortHeadings(adoc);
  const [epigraphs, adocSansEpigraphs] = extractEpigraphs(adoc);
  const [completeHtml, logs] = adocToHtml(adocSansEpigraphs);
  const [notes, htmlSansNotes] = extractNotes(completeHtml);
  return {
    notes,
    epigraphs,
    sections: htmlToSections(htmlSansNotes, shortHeadings),
    logs,
  };
}

function htmlToSections(docHtml: Html, shortHeadings: Map<string, string>): DocSection[] {
  return docHtml
    .split(/(?=<div class="sect1[^>]+?>)/gim)
    .filter(html => !!html.trim())
    .map(addSignedSectionClass)
    .map((html: Html, i: number) => ({ index: i, id: `section${i + 1}`, html }))
    .map(section => extractHeading(section, shortHeadings));
}

function addSignedSectionClass(html: Html): Html {
  const has = html.match(/class="(signed-section|salutation|letter-heading)/gm)
    ? 'has'
    : 'no';
  return html.replace(
    /^<div class="sect1/,
    `<div class="sect1 chapter--${has}-signed-section`,
  );
}

function extractHeading(
  section: Omit<DocSection, 'heading'>,
  short: Map<string, string>,
): DocSection {
  let heading: DocSection['heading'] = { id: '', text: '' };
  const html = section.html.replace(
    /(<div class="sect1([^"]+?)?">\n)<h2 id="([^"]+)"[^>]*?>(.+?)<\/h2>/,
    (_, start, kls, id, inner) => {
      heading = {
        id,
        ...parseHeading(inner),
        ...(short.has(id) ? { shortText: short.get(id) } : {}),
      };
      const match = kls.match(/ style-([a-z]+)/);
      const sectionStart = start.replace(/ style-[a-z]+/, '');
      return `${sectionStart}{% chapter-heading${match ? `, ${match[1]}` : ''} %}`;
    },
  );

  if (heading.id === '') {
    throw new Error(
      `Unable to extract chapter-level heading from section: ${section.id}`,
    );
  }

  return { ...section, html, heading };
}

function parseHeading(text: string): Pick<DocSection['heading'], 'text' | 'sequence'> {
  const pattern = /(chapter|section|capítulo) ((?:[1-9]+[0-9]*)|(?:[ivxlcdm]+))(?::|\.)?(?:\s+([^<]+))?/i;
  const match = text.match(pattern);
  if (!match) {
    return { text: text.trim() };
  }

  const [, type, number, body] = match;
  return {
    text: (body || '').trim(),
    sequence: {
      type: type.replace(/^\w/, c => c.toUpperCase()),
      number: Number.isNaN(+number) ? toArabic(number) : +number,
    },
  };
}
