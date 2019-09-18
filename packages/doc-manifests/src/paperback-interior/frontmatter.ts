import {
  copyright as commonCopyright,
  halfTitle as commonHalfTitle,
  epigraph,
} from '../frontmatter';
import { navText } from '@friends-library/doc-html/src/nav';
import { DocPrecursor, Html, DocSection } from '@friends-library/types';

export default function frontmatter(dpc: DocPrecursor): Html {
  return `
    ${halfTitle(dpc)}
    ${originalTitle(dpc)}
    ${copyright(dpc)}
    ${epigraph(dpc)}
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

function halfTitle(dpc: DocPrecursor): Html {
  return `
    <div class="half-title-page own-page">
      <div>
        ${commonHalfTitle(dpc)}
      </div>
    </div>
  `;
}

function originalTitle({ meta }: DocPrecursor): Html {
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
