// @flow
import { memoize } from 'lodash';
import type { Html } from '../../../../../type';
import type { Job } from '../../type';
import { frontmatter as commonFrontmatter } from '../frontmatter';
import { navText } from '../headings';
import { callMarkup, useSymbols } from './notes';

export const frontmatter = memoize((job: Job): { [string]: Html } => {
  const fm = commonFrontmatter(job);

  fm['half-title'] = `<div class="half-title-page">${fm['half-title']}</div>`;

  if (job.spec.notes.size) {
    fm['footnote-helper'] = footnoteHelper(job);
  }

  if (job.target === 'mobi' && job.spec.sections.length > 1) {
    fm['content-toc'] = contentToc(job);
  }

  return fm;
});


function footnoteHelper({ spec: { notes } }: Job): Html {
  return `
    <div id="fn-call__helper-note" class="footnote-helper">
      <h3>Help with Footnotes</h3>
      <br class="m7"/>
      <p>
        This e-book contains footnotes. When you see a reference number, click it to access the footnote. Once you're done reading the note, it's easy to get back to exactly where you were just reading—just click the the back arrow <span>(\u23CE)</span> after the note, or the ${useSymbols(notes) ? 'symbol' : 'note number'} at the beginning of the note. Here's a sample footnote for you to practice.${callMarkup('helper-note', useSymbols(notes) ? '§' : '1', false)}
      </p>
    </div>
  `.trim();
}

function contentToc({ spec: { sections } }: Job): Html {
  return `
  <section class="content-toc">
    <h1>Table of Contents</h1>
    ${sections.map(sect => (
    `<div>
        <br class="m7"/>
        <a href="${sect.id}.xhtml">
          ${navText(sect.heading)}
        </a>
        <br class="m7"/>
      </div>`
  )).join('\n      ')}
  </section>`.trim();
}
