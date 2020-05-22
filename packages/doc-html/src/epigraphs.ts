import { adocFragmentToHtml } from '@friends-library/adoc-utils';
import { DocPrecursor, Html, Epigraph } from '@friends-library/types';
import { br7 } from './helpers';

export function epigraph({ epigraphs }: Pick<DocPrecursor, 'epigraphs'>): Html {
  if (!epigraphs.length) {
    return '';
  }
  return `
    <div class="epigraphs own-page">
      ${epigraphs.map(renderEpigraph).join(`\n${br7}\n${br7}\n`)}
    </div>
  `;
}

function renderEpigraph({ text, source }: Epigraph, index: number): Html {
  return `
    <div class="epigraph${index > 0 ? ' epigraph--not-first' : ''}">
      <span class="epigraph__text">
        &#8220;${adocFragmentToHtml(text)}&#8221;
      </span>
      ${source ? `<span class="epigraph__source">${source}</span>` : ''}
    </div>
  `;
}
