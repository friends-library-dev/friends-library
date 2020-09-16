import filesize from 'filesize';
import { HTML_DEC_ENTITIES as HEX } from '@friends-library/types';
import { htmlShortTitle } from '@friends-library/adoc-convert';

export function shortTitle(title: string): string {
  return htmlShortTitle(title)
    .replace(new RegExp(HEX.MDASH, `g`), `–`)
    .replace(new RegExp(HEX.NON_BREAKING_SPACE, `g`), ` `);
}

export const humansize = filesize.partial({ round: 0, spacer: `` });
