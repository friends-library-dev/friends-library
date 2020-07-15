import { Asciidoc, Html } from '@friends-library/types';
import { toRoman } from 'roman-numerals';

export function htmlShortTitle(title: Asciidoc): Html {
  return htmlTitle(title.replace(/\bvolumen? \b/i, `Vol.&nbsp;`));
}

export function htmlTitle(title: Asciidoc): Html {
  return title.replace(/ -- /g, ` &mdash; `).replace(/\b\d+$/, digits => {
    return toRoman(Number(digits));
  });
}
