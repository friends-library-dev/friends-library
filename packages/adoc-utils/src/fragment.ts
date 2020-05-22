import { Asciidoc, Html } from '@friends-library/types';

export function adocFragmentToHtml(adoc: Asciidoc): Html {
  return backtickQuotesToEntities(adoc)
    .replace(/--/g, '&#8212;')
    .replace(/ & /g, ' &#38; ')
    .trim();
}

export function backtickQuotesToEntities(adoc: Asciidoc): Asciidoc {
  return adoc
    .replace(/"`/gim, '&#8220;')
    .replace(/`"/gim, '&#8221;')
    .replace(/'`/gim, '&#8216;')
    .replace(/`'/gim, '&#8217;');
}

export function htmlEntitiesToDecimal(adoc: Asciidoc): Asciidoc {
  return adoc.replace(/&hellip;/g, '&#8230;');
}
