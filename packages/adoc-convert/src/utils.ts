import { Asciidoc, Html, HTML_DEC_ENTITIES as HEX } from '@friends-library/types';
import { toRoman } from 'roman-numerals';

export function htmlShortTitle(title: Asciidoc): Html {
  return htmlTitle(title.replace(/\bvolumen? \b/i, `Vol.${HEX.NON_BREAKING_SPACE}`));
}

export function htmlTitle(title: Asciidoc): Html {
  return title.replace(/ -- /g, ` ${HEX.MDASH} `).replace(/\b\d+$/, digits => {
    return toRoman(Number(digits));
  });
}
