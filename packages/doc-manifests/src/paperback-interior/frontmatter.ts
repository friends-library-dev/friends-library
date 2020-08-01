import {
  copyright as commonCopyright,
  halfTitle as commonHalfTitle,
} from '../frontmatter';
import { navText, epigraph } from '@friends-library/doc-html';
import { DocPrecursor, Html, DocSection, Heading } from '@friends-library/types';
import { toRoman } from 'roman-numerals';

export default function frontmatter(dpc: DocPrecursor, volIdx?: number): Html {
  const isFirstOrOnlyVolume = typeof volIdx !== `number` || volIdx === 0;
  return `
    ${halfTitle(dpc, volIdx)}
    ${isFirstOrOnlyVolume ? originalTitle(dpc) : ``}
    ${copyright(dpc)}
    ${isFirstOrOnlyVolume ? epigraph(dpc) : ``}
    ${toc(dpc)}
  `;
}

function toc({ lang, sections }: DocPrecursor): Html {
  if (sections.length <= 3) {
    return ``;
  }
  return `
    <div class="toc own-page">
      <h1>${lang === `en` ? `Contents` : `Índice`}</h1>
      ${sections
        .map(useMultiColLayout(sections) ? multiColTocEntry : tocEntry)
        .join(`\n      `)}
    </div>
  `;
}

export function useMultiColLayout(
  sections: { heading: Omit<Heading, 'id'>; isIntermediateTitle?: boolean }[],
): boolean {
  const regularSections = sections.filter((s) => !s.isIntermediateTitle);
  const headings = regularSections.map((s) => s.heading);
  const namedChapterHeadings = headings.filter((h) => h.text && h.sequence);
  return namedChapterHeadings.length / headings.length > 0.45;
}

function multiColTocEntry({
  heading,
  isIntermediateTitle,
}: Pick<DocSection, 'heading' | 'isIntermediateTitle'>): Html {
  if (isIntermediateTitle) {
    return tocEntry({ heading, isIntermediateTitle });
  }

  return `
    <p class="multicol-toc-entry">
      <a href="#${heading.id || ``}">
        <span class="multicol-toc-chapter">
          ${
            heading.sequence?.number && heading.text
              ? `${toRoman(heading.sequence.number)}.`
              : ``
          }
        </span>
        <span class="multicol-toc-main">
          ${navText({
            ...heading,
            sequence: heading.text ? undefined : heading.sequence,
          })}
        </span>
      </a>
    </p>
    `.trim();
}

function tocEntry({
  heading,
  isIntermediateTitle,
}: Pick<DocSection, 'heading' | 'isIntermediateTitle'>): Html {
  return `
    <p${isIntermediateTitle ? ` class="toc-intermediate-title"` : ``}>
      <a href="#${heading.id || ``}">
        <span>${navText(heading)}</span>
      </a>
    </p>
    `.trim();
}

function copyright(dpc: DocPrecursor): Html {
  return commonCopyright(dpc)
    .replace(`copyright-page`, `copyright-page own-page`)
    .replace(`Ebook created`, `Created`)
    .replace(/([^@])friendslibrary\.com/g, `$1www.friendslibrary.com`);
}

function halfTitle(dpc: DocPrecursor, volIdx?: number): Html {
  return `
    <div class="half-title-page own-page">
      <div>
        ${commonHalfTitle(dpc, volIdx)}
      </div>
    </div>
  `;
}

function originalTitle({ meta }: DocPrecursor): Html {
  if (!meta.originalTitle) {
    return ``;
  }

  return `
    <div class="blank-page own-page"></div>
    <div class="original-title-page own-page">
      <p class="originally-titled__label">
        Original title:
      </p>
      <p class="originally-titled__title">
        ${meta.originalTitle}
      </p>
    </div>
  `;
}
