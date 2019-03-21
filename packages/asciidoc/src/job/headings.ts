import { Asciidoc, Html, Heading, Job } from '@friends-library/types';
import { toRoman } from 'roman-numerals';
import { trimTrailingPunctuation } from './helpers';

export function extractShortHeadings(adoc: Asciidoc): Map<string, string> {
  const headings = new Map();
  const regex = /\[#([a-z0-9-_]+)(?:\.[a-z0-9-_]+?)?,.*?short="(.*?)"\]\n== /gim;
  let match;
  while ((match = regex.exec(adoc))) {
    const [, ref, short] = match;
    headings.set(ref, short);
  }
  return headings;
}

export function replaceHeadings(html: Html, heading: Heading, job: Job): Html {
  // @ts-ignore REMOVE THIS!
  const docStyle = job.spec.config.chapterHeadingStyle || 'normal';
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
        <br class="m7"/>
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
      <br class="m7"/>
      <div class="chapter-heading__title">
        ${textMarkup}
      </div>
      <br class="m7"/>
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
        return `<span class="line line-1">${part} <br class="m7"/></span>`;
      }
      if (index === parts.length - 1) {
        return `<span class="line line-${index + 1}">${part}</span>`;
      }
      return `<span class="line line-${index + 1}">${part}</span>`;
    })
    .join('');
}

export function navText({ text, shortText, sequence }: Heading): string {
  const mainText = trimTrailingPunctuation(shortText || text).replace(/ \/ .+/, '');
  if (!sequence) {
    return mainText;
  }

  return `${sequence.type} ${toRoman(sequence.number)}${
    mainText ? ` &#8212; ${mainText}` : ''
  }`;
}
