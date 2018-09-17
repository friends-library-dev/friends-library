// @flow
import { toRoman } from 'roman-numerals';
import { trimTrailingPunctuation } from './text';
import type { Html, Heading, Job } from '../type';

export function replaceHeadings(html: Html, heading: Heading, job: Job): Html {
  const docStyle = job.spec.config.chapterHeadingStyle || 'normal';
  return html.replace(
    /{% chapter-heading(?:, ([a-z]+))? %}/,
    (_, style) => headingMarkup(heading, style || docStyle),
  );
}

function headingMarkup({ id, sequence, text }: Heading, style: string): Html {
  if (!sequence || (sequence && !text)) {
    return `
      <div class="chapter-heading chapter-heading--${style}" id="${id}">
        <h2>${!sequence ? text : `${sequence.type} ${toRoman(sequence.number)}`}</h2>
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
        ${text}
      </div>
      <br class="m7"/>
    </div>
  `;
}

export function navText({ text, shortText, sequence }: Heading): string {
  const mainText = trimTrailingPunctuation(shortText || text);
  if (!sequence) {
    return mainText;
  }

  return `${sequence.type} ${toRoman(sequence.number)}${mainText ? ` &#8212; ${mainText}` : ''}`;
}
