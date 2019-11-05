import {
  copyright as commonCopyright,
  halfTitle as commonHalfTitle,
} from '../frontmatter';
import { navText, epigraph } from '@friends-library/doc-html';
import { DocPrecursor, Html, DocSection } from '@friends-library/types';

export default function frontmatter(dpc: DocPrecursor, volIdx?: number): Html {
  const isFirstOrOnlyVolume = typeof volIdx !== 'number' || volIdx === 0;
  return `
    ${halfTitle(dpc, volIdx)}
    ${isFirstOrOnlyVolume ? originalTitle(dpc, volIdx) : ''}
    ${copyright(dpc)}
    ${isFirstOrOnlyVolume ? epigraph(dpc) : ''}
    ${toc(dpc)}
  `;
}

function toc({ lang, sections }: DocPrecursor): Html {
  if (sections.length === 1) {
    return '';
  }
  return `
    <div class="toc own-page">
      <h1>${lang === 'en' ? 'Contents' : 'Índice'}</h1>
      ${sections.map(tocEntry).join('\n      ')}
    </div>
  `;
}

function tocEntry({ heading }: DocSection): Html {
  return `
    <p>
      <a href="#${heading.id || ''}">
        <span>${navText(heading)}</span>
      </a>
    </p>
    `.trim();
}

function copyright(dpc: DocPrecursor): Html {
  return commonCopyright(dpc)
    .replace('copyright-page', 'copyright-page own-page')
    .replace('Ebook created', 'Created')
    .replace(/([^@])friendslibrary\.com/g, '$1www.friendslibrary.com');
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

function originalTitle({ meta }: DocPrecursor, volIdx?: number): Html {
  if (!meta.originalTitle) {
    return '';
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
