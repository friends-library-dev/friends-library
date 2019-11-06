import { Html, Heading, DocPrecursor } from '@friends-library/types';
import { toRoman } from 'roman-numerals';
import { br7 } from './helpers';

export function replaceHeadings(
  html: Html,
  heading: Heading,
  dpc: Pick<DocPrecursor, 'config'>,
): Html {
  const docStyle = dpc.config.chapterHeadingStyle || 'normal';
  return html.replace(/{% chapter-heading(?:, ([a-z]+))? %}/, (_, style) =>
    headingMarkup(heading, style || docStyle),
  );
}

function headingMarkup({ id, sequence, text }: Heading, style: string): Html {
  const textMarkup = headingTextMarkup(text);
  if (!sequence || (sequence && !text)) {
    return `
      <div class="chapter-heading chapter-heading--${style}" id="${id}">
        <h2>${
          !sequence ? textMarkup : `${sequence.type} ${toRoman(sequence.number)}`
        }</h2>
        ${br7}
      </div>
    `;
  }

  return `
    <div class="chapter-heading chapter-heading--${style}" id="${id}">
      <h2 class="chapter-heading__sequence">
        ${sequence.type}&#160;
        <span class="chapter-heading__sequence__number">
          ${toRoman(sequence.number)}
        </span>
      </h2>
      ${br7}
      <div class="chapter-heading__title">
        ${textMarkup}
      </div>
      ${br7}
    </div>
  `;
}

function headingTextMarkup(text: string): string {
  if (text.indexOf(' / ') === -1) {
    return text;
  }

  return text
    .split(' / ')
    .map((part, index, parts) => {
      if (index === 0) {
        return `<span class="line line-1">${part} ${br7}</span>`;
      }
      if (index === parts.length - 1) {
        return `<span class="line line-${index + 1}">${part}</span>`;
      }
      return `<span class="line line-${index + 1}">${part}</span>`;
    })
    .join('');
}
