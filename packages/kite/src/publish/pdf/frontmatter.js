// @flow
import type { Job, Html, DocSection } from '../../type';
import { copyright as commonCopyright } from '../frontmatter';
import { navText } from '../headings';

export function frontmatter(job: Job): Html {
  return `
    ${halfTitle(job)}
    ${originalTitle(job)}
    ${copyright(job)}
    ${toc(job)}
  `;
}

function toc({ spec: { sections } }: Job): Html {
  return `
    <div class="toc own-page">
      <h1>Contents</h1>
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
    .replace('Ebook revision', 'Text revision:')
    .replace('Ebook created', 'Created')
    .replace(/([^@])friendslibrary\.com/g, '$1www.friendslibrary.com');
}

function halfTitle({ spec: { meta: { title, author } } }: Job): Html {
  return `
    <div class="half-title-page own-page">
      <div>
        <h1>${title}</h1>
        <p class="byline">by ${author.name}</p>
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
