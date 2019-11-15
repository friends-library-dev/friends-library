import { DocSection, Html } from '@friends-library/types';
import { replaceHeadings } from './headings';

export function webHtml(sections: DocSection[]): Html {
  return sections
    .map(({ html, heading }) => replaceHeadings(html, heading, { config: {} }))
    .join('\n')
    .replace(/{% note: [a-z0-9-]+ %}/gim, '<span class="footnote"></span>');
}
