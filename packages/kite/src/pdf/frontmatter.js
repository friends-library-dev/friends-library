// @flow
import type { SourceSpec, Html } from '../type';
import { copyright as epubCopyright } from '../epub/frontmatter';
import { entryText } from '../epub/toc';

export function frontmatter(spec: SourceSpec): Html {
  return `
    ${halfTitle(spec)}
    ${originalTitle(spec)}
    ${copyright(spec)}
    ${toc(spec)}
  `;
}

function toc({ sections, config }: SourceSpec): Html {
  return `
    <div class="toc own-page">
      <h1>Contents</h1>
      ${sections.filter(s => s.id !== 'notes').map((section) => {
    return `
          <p>
            <a href="#${section.ref || ''}">
              <span>${entryText(section, config)}</span>
            </a>
          </p>
        `;
  }).join('\n')}
    </div>
  `;
}

function copyright(spec: SourceSpec): Html {
  const html = epubCopyright(spec);
  return html
    .replace('copyright-page', 'copyright-page own-page')
    .replace('Ebook revision', 'Text revision:')
    .replace('Ebook created', 'Created')
    .replace(/([^@])friendslibrary\.com/g, '$1www.friendslibrary.com');
}

function halfTitle({ document, friend }: SourceSpec): Html {
  return `
    <div class="half-title-page own-page">
      <div>
        <h1>${document.title}</h1>
        <p class="byline">by ${friend.name}</p>
      </div>
    </div>
  `;
}


function originalTitle({ document }: SourceSpec): Html {
  if (!document.originalTitle) {
    return '';
  }

  return `
    <div class="blank-page own-page"></div>
    <div class="original-title-page own-page">
      <p class="originally-titled__label">
        Original title:
      </p>
      <p class="originally-titled__title">
        ${document.originalTitle}
      </p>
    </div>
  `;
}
