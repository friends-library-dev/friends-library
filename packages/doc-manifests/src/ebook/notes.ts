import { Html, Lang, DocPrecursor, DocSection, Notes } from '@friends-library/types';

const symbolMap = new Map([[1, '§'], [2, '*'], [3, '†'], [4, '‡']]);

function makeGetRef({ notes }: DocPrecursor): (num: number) => number | string {
  return (num: number) => (useSymbols(notes) ? symbolMap.get(num) || '' : num);
}

export function useSymbols(notes: Notes): boolean {
  return notes.size < 4;
}

export function makeFootnoteCallReplacer(dpc: DocPrecursor): (html: Html) => Html {
  let number = 2; // starts at two to make room for dynamically inserted helper note
  const getRef = makeGetRef(dpc);
  return (html: Html): Html => {
    return html.replace(/{% note: ([a-z0-9-]+) %}/gim, (_, id) =>
      callMarkup(id, getRef(number++)),
    );
  };
}

export function callMarkup(
  id: string,
  ref: string | number,
  withId: boolean = true,
): Html {
  return [
    `<sup class="footnote"${withId ? ` id="fn-call__${id}"` : ''}>`,
    `<a href="notes.xhtml#fn__${id}" title="View footnote.">`,
    ref,
    '</a>',
    '</sup>',
  ].join('');
}

export function notesMarkup(dpc: DocPrecursor): Html {
  const { lang, notes, sections } = dpc;
  const locations = getNoteLocations(sections);
  const helperNote = getHelperNote(useSymbols(notes), lang);
  const getRef = makeGetRef(dpc);
  return `
    <div id="footnotes">
      <div class="footnote" id="fn__helper-note">
        <a href="footnote-helper.xhtml#fn-call__helper-note">${getRef(
          1,
        )}</a> ${helperNote}
        <a href="footnote-helper.xhtml#fn-call__helper-note">\u23CE</a>
        <br class="m7"/>
        <br class="m7"/>
      </div>
      ${[...notes]
        .map(
          ([id, note], index) =>
            `<div class="footnote" id="fn__${id}">
          <a href="${locations.get(id) || ''}.xhtml#fn-call__${id}">${getRef(
              index + 2,
            )}</a> ${note}
          <a href="${locations.get(id) || ''}.xhtml#fn-call__${id}">\u23CE</a>
          <br class="m7"/>
          <br class="m7"/>
        </div>`,
        )
        .join('\n      ')}
    </div>
`.trim();
}

function getNoteLocations(sections: DocSection[]): Map<string, string> {
  return sections.reduce((locations, section) => {
    let match;
    const regex = /{% note: ([a-z0-9-]+) %}/gim;
    while ((match = regex.exec(section.html))) {
      const [, noteId] = match;
      locations.set(noteId, section.id);
    }
    return locations;
  }, new Map());
}

function getHelperNote(symbols: boolean, lang: Lang): string {
  if (lang === 'en') {
    return `You made it to the notes area! To get back to where you just were, click the back arrow (\u23CE) at the end of the note, or the ${
      symbols ? 'symbol' : 'number'
    } at the beginning of the note, or use your e-reader’s “back to page...” feature.`;
  }
  // TODO need spanish for "symbol" or "number"
  return '¡Llegaste a la sección de notas! Para volver al lugar donde estabas leyendo, haz clic en la pequeña flecha (\u23CE) al final de la nota, o en el número al principio de la nota, o donde tu aplicación dice  “volver a la página.”';
}
