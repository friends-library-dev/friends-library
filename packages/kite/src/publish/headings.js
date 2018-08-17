// @flow
import type { Html, Heading } from '../type';

export function replaceHeadings(html: Html, heading: Heading): Html {
  return html.replace(
    '{% chapter-heading %}',
    headingMarkup(heading),
  );
}

function headingMarkup({ id, sequence, text }: Heading): Html {
  if (!sequence) {
    return `
      <div class="chapter" id="${id}">
        <h2>${text}</h2>
        <br class="m7"/>
      </div>
    `;
  }

  return `
    <div class="chapter" id="${id}">
      <h2 class="chapter__sequence">
        ${sequence.type === 'chapter' ? 'Chapter ' : 'Section '}
        <span class="chapter__sequence__number">
          ${sequence.number}
        </span>
      </h2>
      <br class="m7"/>
      <div class="chapter__title">
        ${text}
      </div>
      <br class="m7"/>
    </div>
  `;
}

export function navText({ text, shortText, sequence }: Heading): string {
  if (!sequence) {
    return shortText || text;
  }

  const type = sequence.type === 'chapter' ? 'Chapter' : 'Section';
  return `${type} ${sequence.number} &#8212; ${shortText || text}`;
}
