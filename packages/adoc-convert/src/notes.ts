import uuid from 'uuid';
import striptags from 'striptags';
import { Html, Notes } from '@friends-library/types';
import { makeReduceWrapper as makeWrap } from './helpers';
import { br7 } from '@friends-library/doc-html';

export function extractNotes(srcHtml: Html): [Notes, Html] {
  const map = new Map();
  let html = srcHtml.replace(
    /<sup class="footnote">\[<a id="_footnoteref_([0-9]+)"[\s\S]+?<\/sup>/gim,
    (_, num) => {
      const id = uuid();
      map.set(num, id);
      return `{% note: ${id} %}`;
    },
  );

  const notes = new Map();
  html = html.replace(
    /<div class="footnote" id="_footnotedef_([0-9]+)[\S\s]+?<\/div>/gim,
    (full, num) => {
      const note = striptags(full, [`em`, `i`, `strong`, `b`, `span`])
        .trim()
        .replace(
          /{footnote-paragraph-split}/g,
          `<span class="fn-split">${br7}${br7}</span>`,
        )
        .replace(/^[0-9]+\. /, ``);
      notes.set(map.get(num) || ``, expandFootnotePoetry(note));
      return ``;
    },
  );

  html = html.replace(/<div id="footnotes"[\s\S]+?<\/div>/gim, ``);

  return [notes, html];
}

function expandFootnotePoetry(html: Html): Html {
  const nowrap = makeWrap(``, ``);
  return html.replace(/ ` {4}(.+?) *?`( )?/gim, (_, poem) => {
    let stanzas = false;
    return poem
      .split(`      `)
      .map((line: string) => {
        if (line.match(/^- - -/)) {
          stanzas = true;
          return `</span>\n<span class="verse__stanza">`;
        }
        const spacer = `&#160;&#160;&#160;&#160;`;
        line = line.replace(/^ +/, (leadingWhitespace: string) =>
          leadingWhitespace
            .split(``)
            .map(() => spacer)
            .join(``),
        );
        return `<span class="verse__line">${br7}${line}</span>`;
      })
      .reduce(stanzas ? makeWrap(`<span class="verse__stanza">`, `</span>`) : nowrap, [])
      .reduce(makeWrap(`<span class="verse">${br7}`, `</span>`), [])
      .join(`\n`);
  });
}
