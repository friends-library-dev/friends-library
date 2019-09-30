import {
  copyright as commonCopyright,
  halfTitle as commonHalfTitle,
  epigraph,
} from './frontmatter';
import { navText } from './headings';
import { Job, Html, DocSection } from '@friends-library/types';

export function pdfFrontmatter(job: Job): Html {
  if (!job.meta.frontmatter) {
    return '';
  }

  return `
    ${halfTitle(job)}
    ${originalTitle(job)}
    ${copyright(job)}
    ${epigraph(job)}
    ${toc(job)}
  `;
}

function toc({ spec: { lang, sections } }: Job): Html {
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

function copyright(job: Job): Html {
  return commonCopyright(job)
    .replace('copyright-page', 'copyright-page own-page')
    .replace('Ebook created', 'Created')
    .replace(/([^@])friendslibrary\.com/g, '$1www.friendslibrary.com');
}

function halfTitle(job: Job): Html {
  return `
    <div class="half-title-page own-page">
      <div>
        ${commonHalfTitle(job)}
      </div>
    </div>
  `;
}

function originalTitle({ spec: { meta } }: Job): Html {
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