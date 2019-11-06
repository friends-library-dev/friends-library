import { Asciidoc, DocSection } from '@friends-library/types';
import { toArabic } from 'roman-numerals';

export function extractShortHeadings(adoc: Asciidoc): Map<string, string> {
  const headings = new Map();
  const regex = /\[#([a-z0-9-_]+)(?:\.[a-z0-9-_]+?)?,.*?short="(.*?)"\]\n== /gim;
  let match;
  while ((match = regex.exec(adoc))) {
    const [, ref, short] = match;
    headings.set(ref, entitiesToDecimal(short));
  }
  return headings;
}

export function extractHeading(
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
    return { text: entitiesToDecimal(text.trim()) };
  }

  const [, type, number, body] = match;
  return {
    text: entitiesToDecimal((body || '').trim()),
    sequence: {
      type: type.replace(/^\w/, c => c.toUpperCase()),
      number: Number.isNaN(+number) ? toArabic(number) : +number,
    },
  };
}

function entitiesToDecimal(text: string): string {
  return text.replace(/ & /g, ' &#38; ');
}
