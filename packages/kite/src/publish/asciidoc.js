// @flow
import Asciidoctor from 'asciidoctor.js';
import type { Asciidoc, Html } from '../type';

const asciidoctor = Asciidoctor();

export function convert(adoc: Asciidoc): Html {
  let html = asciidoctor.convert(adoc);

  if (html.includes(practiceNote.substr(0, 20))) {
    html = html.replace(/<sup[\s\S]+?<\/sup>/, '');
  }

  html = html.replace(
    /<div id="footnotes">\s*<hr>/,
    '<div id="footnotes">\n',
  );

  return ((html: any): Html);
}

export function prepareAsciidoc(raw: Asciidoc): Asciidoc {
  let prepared = raw
    .replace(/\^\nfootnote:\[/igm, 'footnote:[')
    .replace(/"`/igm, '“')
    .replace(/`"/igm, '”')
    .replace(/'`/igm, '‘')
    .replace(/`'/igm, '’')
    .replace(/--/igm, '&#8212;')
    .replace(/\[\.asterism\]\n'''/igm, '++++\n<div class="asterism">*&#160;&#160;*&#160;&#160;*</div>\n++++');

  if (prepared.includes('footnote:[')) {
    prepared = prepared.replace(
      /(?=footnote:\[)/,
      `footnote:[${practiceNote}]`,
    );
  }
  return prepared;
}


const practiceNote = 'You made it to the notes area! To get back to where you just were, click the back arrow (\u23CE) at the end of the note, or the number at the beginning of the note, or use your e-reader’s “back to page...” feature.';
