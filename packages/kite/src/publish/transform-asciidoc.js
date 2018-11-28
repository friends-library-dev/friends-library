// @flow
import { flow, memoize } from 'lodash';
import type { Asciidoc } from '../../../../type';
import { br7 } from './html';

export const transformAsciidoc: (adoc: Asciidoc) => Asciidoc = memoize(flow([
  replaceAsterisms,
  changeChapterSynopsisMarkup,
  changeChapterSubtitleBlurbMarkup,
  prepareDiscourseParts,
  discreteize,
  headingsInOpenBlocks,
  preserveLineEndingDashesInVerse,
  emdashBeforeBookTitle,
  adoc => adoc.replace(/[–|—]/g, '--'),
  adoc => adoc.replace(/"`/igm, '&#8220;'),
  adoc => adoc.replace(/`"/igm, '&#8221;'),
  adoc => adoc.replace(/'`/igm, '&#8216;'),
  adoc => adoc.replace(/`'/igm, '&#8217;'),
  adoc => adoc.replace(/(\[\.signed-section-signature\]\n)/gm, '$1--'),
  adoc => adoc.replace(/\n--\n/gm, '{open-block-delimiter}'),
  adoc => adoc.replace(/(?<!class="[a-z- ]+)--/gm, '&#8212;'),
  adoc => adoc.replace(/{open-block-delimiter}/gm, '\n--\n'),
  adoc => adoc.replace(/&#8212;\n([a-z]|&#8220;|&#8216;)/gim, '&#8212;$1'),
  adoc => adoc.replace(/ &#8220;\n([a-z])/gim, ' &#8220;$1'),
  adoc => adoc.replace(/&#8212;(?:\n)?_([^_]+?)_(?=[^_])/gm, '&#8212;__$1__'),
  adoc => adoc.replace(/\^\nfootnote:\[/igm, 'footnote:['),
  adoc => adoc.replace(/\[\.small-break\]\n'''/gm, raw(`<div class="small-break">${br7}</div>`)),
  adoc => adoc.replace(/#footnote:\[/g, '#{blank}footnote:['),
  adoc => adoc.replace(/{verse-end-emdash}/g, '&#8212;'),
]));


function emdashBeforeBookTitle(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /--\[\.book-title\]#([\s|\S]+?)#/gm,
    '--+++<span class="book-title">+++$1+++</span>+++',
  );
}
function preserveLineEndingDashesInVerse(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /(?<=\n\[verse.*?\]\n____\n)([\s|\S]+?)(?=\n____)/gm,
    (_, verseLines) => verseLines.replace(/--\n/mg, '{verse-end-emdash}\n'),
  );
}

function prepareDiscourseParts(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /(?<=\[\.discourse-part\]\n)(Question:|Answer(?: [0-9]+)?:|Objection:|Inquiry [0-9]+:)( |\n)/gim,
    '_$1_$2',
  );
}

function replaceAsterisms(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[\.asterism\]\n'''/igm,
    raw(`<div class="asterism">${br7}*&#160;&#160;*&#160;&#160;*${br7}${br7}</div>`),
  );
}

function changeChapterSynopsisMarkup(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[\.chapter-synopsis\]\n([\s\S]+?)(?=\n\n)/gim,
    (_, inner) => {
      const joined = inner
        .trim()
        .split('\n')
        .map(line => line.trim())
        .map(line => line.replace(/^\* /, ''))
        .join('&#8212;');
      return `[.chapter-synopsis]\n${joined}\n\n`;
    },
  );
}

function changeChapterSubtitleBlurbMarkup(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[\.chapter-subtitle--blurb\]\n([\s\S]+?)(?=\n\n)/gim,
    (_, inner) => {
      const joined = inner
        .trim()
        .split('\n')
        .join(' ');
      return raw(`<h3 class="chapter-subtitle--blurb">${joined}</h3>`);
    },
  );
}

function discreteize(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /\[((?:\.blurb|\.alt|\.centered)+)\]\n(====?) /gm,
    '[discrete$1]\n$2 ',
  );
}

function headingsInOpenBlocks(adoc: Asciidoc): Asciidoc {
  return adoc.replace(
    /(\n--\n\n)([\s\S]*?)(\n\n--\n)/igm,
    (_, open, content, end) => {
      const inner = content.replace(
        /(^|\n\n)(?:\[([^\]]+?)\]\n)?(===+ )/igm,
        (__, start, bracket, heading) => {
          const discrete = (bracket || '').indexOf('discrete') !== -1 ? '' : 'discrete';
          return `${start}[${discrete}${bracket || ''}]\n${heading}`;
        },
      );
      return `${open}${inner}${end}`;
    },
  );
}

function raw(input: string): Asciidoc {
  return `++++\n${input}\n++++`;
}
