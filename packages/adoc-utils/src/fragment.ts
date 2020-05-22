import {
  ADOC_SYNTAX as adoc,
  HTML_DEC_ENTITIES as html,
  Asciidoc,
  Html,
} from '@friends-library/types';

export function adocFragmentToHtml(adoc: Asciidoc): Html {
  return backtickQuotesToEntities(adoc)
    .replace(/--/g, html.MDASH)
    .replace(/ & /g, ` ${html.AMPERSAND} `)
    .trim();
}

export function backtickQuotesToEntities(asciidoc: Asciidoc): Asciidoc {
  return asciidoc
    .replace(
      new RegExp(`${adoc.RIGHT_DOUBLE_QUOTE}${adoc.RIGHT_SINGLE_QUOTE}`, 'gim'),
      `${html.RIGHT_DOUBLE_QUOTE}${html.RIGHT_SINGLE_QUOTE}`,
    )
    .replace(
      new RegExp(`${adoc.RIGHT_SINGLE_QUOTE}${adoc.RIGHT_DOUBLE_QUOTE}`, 'gim'),
      `${html.RIGHT_SINGLE_QUOTE}${html.RIGHT_DOUBLE_QUOTE}`,
    )
    .replace(new RegExp(adoc.LEFT_DOUBLE_QUOTE, 'gim'), html.LEFT_DOUBLE_QUOTE)
    .replace(new RegExp(adoc.RIGHT_DOUBLE_QUOTE, 'gim'), html.RIGHT_DOUBLE_QUOTE)
    .replace(new RegExp(adoc.LEFT_SINGLE_QUOTE, 'gim'), html.LEFT_SINGLE_QUOTE)
    .replace(new RegExp(adoc.RIGHT_SINGLE_QUOTE, 'gim'), html.RIGHT_SINGLE_QUOTE);
}

export function htmlEntitiesToDecimal(adoc: Asciidoc): Asciidoc {
  return adoc.replace(/&hellip;/g, html.ELLIPSES);
}
