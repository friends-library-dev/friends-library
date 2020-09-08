import { Html } from '@friends-library/types';
import { br7 } from '@friends-library/doc-html';
import flow from 'lodash/flow';
import memoize from 'lodash/memoize';
import intersection from 'lodash/intersection';
import { makeReduceWrapper as makeWrap } from './helpers';

export const postProcessHtml: (html: Html) => Html = memoize(
  flow([
    closeColTags,
    changeVerseMarkup,
    modifyOldStyleHeadings,
    (html) => html.replace(/<hr>/gim, `<hr />`),
    (html) => html.replace(/<br>/gim, `<br />`),
    (html) => html.replace(/<blockquote>/gim, `<blockquote>${br7}`),
    removeParagraphClass,
    (html) =>
      html.replace(
        /(?<=<div class="offset">\n)([\s\S]*?)(?=<\/div>)/gim,
        `${br7}$1${br7}`,
      ),
    (html) =>
      html.replace(
        /<div class="discourse-part">/gm,
        `<div class="discourse-part">${br7}`,
      ),
  ]),
);

function closeColTags(html: Html): Html {
  return html.replace(/<col( ([^>])*)?\/?>/gim, `<col$1></col>`);
}

function modifyOldStyleHeadings(html: Html): Html {
  return html.replace(
    /<div class="sect2 old-style( [^"]+?)?">\n<h3 ([^>]+?)>([\s\S]+?)<\/h3>/gim,
    (_, kls, h3id, text) => {
      const inner = text
        .split(` / `)
        .map((part: string, index: number, parts: string[]) => {
          if (index === 0) {
            return `<span>${part} ${br7}</span>`;
          }
          if (index === parts.length - 1) {
            return `<span><em>${part}</em></span>`;
          }
          return `<span><em>${part}</em> ${br7}</span>`;
        })
        .join(``);
      return `<div class="sect2"><h3 ${h3id} class="old-style${kls || ``}">${inner}</h3>`;
    },
  );
}

function removeParagraphClass(html: Html): Html {
  const standalone = [
    `salutation`,
    `discourse-part`,
    `offset`,
    `numbered`,
    `the-end`,
    `postscript`,
    `chapter-synopsis`,
    `letter-participants`,
    `signed-section-signature`,
    `signed-section-closing`,
    `signed-section-context-open`,
    `signed-section-context-close`,
  ];

  return html.replace(/<div class="paragraph ([a-z0-9- ]+?)">/g, (full, extra) => {
    const classes = extra.split(` `);
    if (intersection(standalone, classes).length) {
      return `<div class="${extra}">`;
    }
    return full;
  });
}

function changeVerseMarkup(html: Html): Html {
  return html.replace(
    /<div class="verseblock">\n<pre class="content">([\s\S]*?)<\/pre>\n<\/div>/gim,
    (_, verses) => {
      const hasStanzas = verses.match(/\n\n/gm);
      const stanzaOpen = hasStanzas ? `\n<div class="verse__stanza">` : ``;
      const stanzaClose = hasStanzas ? `</div>\n` : ``;
      return verses
        .trim()
        .split(`\n`)
        .map((verse: string) =>
          verse
            ? `<div class="verse__line">${verse}</div>`
            : `${stanzaClose}${stanzaOpen}`,
        )
        .reduce(makeWrap(`<div class="verse">${stanzaOpen}`, `${stanzaClose}</div>`), [])
        .join(`\n`);
    },
  );
}
