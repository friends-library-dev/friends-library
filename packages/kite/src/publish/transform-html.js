// @flow
import { flow, memoize, intersection } from 'lodash';
import type { Html } from '../../../../type';
import { br7 } from './html';
import { wrapper } from './text';

export const transformHtml: (html: Html) => Html = memoize(flow([
  changeVerseMarkup,
  modifyOldStyleHeadings,
  html => html.replace(/<hr>/igm, '<hr />'),
  html => html.replace(/<br>/igm, '<br />'),
  html => html.replace(/<blockquote>/igm, `<blockquote>${br7}`),
  removeParagraphClass,
  html => html.replace(/(?<=<div class="offset">\n)([\s\S]*?)(?=<\/div>)/gim, `${br7}$1${br7}`),
  html => html.replace(/<div class="discourse-part">/gm, `<div class="discourse-part">${br7}`),
]));

function modifyOldStyleHeadings(html: Html): Html {
  return html.replace(
    /<div class="sect2 old-style( [^"]+?)?">\n<h3 ([^>]+?)>([\s\S]+?)<\/h3>/igm,
    (_, kls, h3id, text) => {
      const inner = text.split(' / ').map((part, index, parts) => {
        if (index === 0) {
          return `<span>${part} <br class="m7"/></span>`;
        }
        if (index === parts.length - 1) {
          return `<span><em>${part}</em></span>`;
        }
        return `<span><em>${part}</em> <br class="m7"/></span>`;
      }).join('');
      return `<div class="sect2"><h3 ${h3id} class="old-style${kls || ''}">${inner}</h3>`;
    },
  );
}

function removeParagraphClass(html: Html): Html {
  const standalone = [
    'salutation',
    'discourse-part',
    'offset',
    'numbered',
    'the-end',
    'postscript',
    'chapter-synopsis',
    'letter-participants',
    'signed-section-signature',
    'signed-section-closing',
    'signed-section-context-open',
    'signed-section-context-close',
  ];

  return html.replace(
    /<div class="paragraph ([a-z0-9- ]+?)">/g,
    (full, extra) => {
      const classes = extra.split(' ');
      if (intersection(standalone, classes).length) {
        return `<div class="${extra}">`;
      }
      return full;
    },
  );
}

function changeVerseMarkup(html: Html): Html {
  return html.replace(
    /<div class="verseblock">\n<pre class="content">([\s\S]*?)<\/pre>\n<\/div>/gim,
    (_, verses) => {
      const hasStanzas = verses.match(/\n\n/gm);
      const stanzaOpen = hasStanzas ? '\n<div class="verse__stanza">' : '';
      const stanzaClose = hasStanzas ? '</div>\n' : '';
      return verses
        .trim()
        .split('\n')
        .map(v => (v ? `<div class="verse__line">${v}</div>` : `${stanzaClose}${stanzaOpen}`))
        .reduce(wrapper(`<div class="verse">${stanzaOpen}`, `${stanzaClose}</div>`), [])
        .join('\n');
    },
  );
}
