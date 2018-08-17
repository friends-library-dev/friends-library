// @flow
import type { Html, Job, DocSection } from '../../type';

export function makeFootnoteCallReplacer(number: number): (html: Html) => Html {
  return (html: Html): Html => {
    return html.replace(
      /{% note: ([a-z0-9-]+) %}/gim,
      (_, id) => callMarkup(id, number++),
    );
  };
}

export function callMarkup(id: string, num: number, withId: boolean = true): Html {
  return [
    `<sup class="footnote"${withId ? ` id="fn-call__${id}"` : ''}>`,
    `<a href="notes.xhtml#fn__${id}" title="View footnote.">`,
    num,
    '</a>',
    '</sup>',
  ].join('');
}

export function notesMarkup({ spec: { notes, sections } }: Job): Html {
  const locations = getNoteLocations(sections);
  return `
    <div id="footnotes">
      <div class="footnote" id="fn__helper-note">
        <a href="footnote-helper.xhtml#fn-call__helper-note">1</a> ${practiceNote}
        <a href="footnote-helper.xhtml#fn-call__helper-note">\u23CE</a>
        <br class="m7"/>
        <br class="m7"/>
      </div>
      ${[...notes].map(([id, note], index) => (
    `<div class="footnote" id="fn__${id}">
          <a href="${locations.get(id) || ''}.xhtml#fn-call__${id}">${index + 2}</a> ${note}
          <a href="${locations.get(id) || ''}.xhtml#fn-call__${id}">\u23CE</a>
          <br class="m7"/>
          <br class="m7"/>
        </div>`
  )).join('\n      ')}
    </div>
`.trim();
}

function getNoteLocations(sections: Array<DocSection>): Map<string, string> {
  return sections.reduce((locations, section) => {
    let match;
    const regex = /{% note: ([a-z0-9-]+) %}/gim;
    while ((match = regex.exec(section.html))) {
      const [_, noteId] = match;
      locations.set(noteId, section.id);
    }
    return locations;
  }, new Map());
}

const practiceNote = 'You made it to the notes area! To get back to where you just were, click the back arrow (\u23CE) at the end of the note, or the number at the beginning of the note, or use your e-reader’s “back to page...” feature.';
