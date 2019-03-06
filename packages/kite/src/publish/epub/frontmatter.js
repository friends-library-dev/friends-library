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


function footnoteHelper({ spec: { lang, notes } }: Job): Html {
  let helpNote = `This e-book contains footnotes. When you see a reference number, click it to access the footnote. Once you're done reading the note, it's easy to get back to exactly where you were just reading—just click the back arrow <span>(\u23CE)</span> after the note, or the ${useSymbols(notes) ? 'symbol' : 'note number'} at the beginning of the note. Here's a sample footnote for you to practice.${callMarkup('helper-note', useSymbols(notes) ? '§' : '1', false)}`;
  if (lang === 'es') {
    helpNote = `Este libro electrónico contiene notas a pie de página. Cuando veas un número de referencia, haz clic ahí para acceder a la nota al pie. Una vez que hayas terminado de leer la nota, es fácil regresar al lugar exacto en el que estabas leyendo, simplemente haz clic en la pequeña flecha <span>(\u23CE)</span> después de la nota, o el número al principio de la nota. Aquí hay una nota para que practiques${callMarkup('helper-note', useSymbols(notes) ? '§' : '1', false)}`;
  }
  return `
    <div id="fn-call__helper-note" class="footnote-helper">
      <h3>${lang === 'en' ? 'Help with Footnotes' : 'Ayuda con las Notas a Pie de Página'}</h3>
      <br class="m7"/>
      <p>
        ${helpNote}
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
