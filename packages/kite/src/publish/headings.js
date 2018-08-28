// @flow
import type { Html, Heading, Job } from '../type';

export function replaceHeadings(html: Html, heading: Heading, job: Job): Html {
  const docStyle = job.spec.config.chapterHeadingStyle || 'normal';
  return html.replace(
    /{% chapter-heading(?:, ([a-z]+))? %}/,
    (_, style) => headingMarkup(heading, style || docStyle),
  );
}

function headingMarkup({ id, sequence, text }: Heading, style: string): Html {
  if (!sequence) {
    return `
      <div class="chapter-heading chapter-heading--${style}" id="${id}">
        <h2>${text}</h2>
        <br class="m7"/>
      </div>
    `;
  }

  return `
    <div class="chapter-heading chapter-heading--${style}" id="${id}">
      <h2 class="chapter-heading__sequence">
        ${sequence.type === 'chapter' ? 'Chapter ' : 'Section '}
        <span class="chapter-heading__sequence__number">
          ${sequence.number}
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
  const mainText = (shortText || text).replace(/(?<!etc)\.$/, '');
  if (!sequence) {
    return mainText;
  }

  const type = sequence.type === 'chapter' ? 'Chapter' : 'Section';
  return `${type} ${sequence.number} &#8212; ${mainText}`;
}
