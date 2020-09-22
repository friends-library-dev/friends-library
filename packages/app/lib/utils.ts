import filesize from 'filesize';
import { HTML_DEC_ENTITIES as HEX } from '@friends-library/types';
import { htmlShortTitle } from '@friends-library/adoc-convert';

export function shortTitle(title: string): string {
  return htmlShortTitle(title)
    .replace(new RegExp(HEX.MDASH, `g`), `–`)
    .replace(new RegExp(HEX.NON_BREAKING_SPACE, `g`), ` `);
}

export const humansize = filesize.partial({ round: 0, spacer: `` });

export function backgroundPartTitle(partTitle: string, bookTitle: string): string {
  return partTitle.replace(
    /^(Parte?|Chapter|Capítulo|Sección|Section) (\d+)$/,
    (_, type: string, num: string) => {
      return `${ABBREV_MAP[type]}. ${num}—${bookTitle}`;
    },
  );
}

const ABBREV_MAP: Record<string, string> = {
  Part: `Pt`,
  Parte: `Pt`,
  Chapter: `Ch`,
  Section: `Sect`,
  Sección: `Pt`,
  Capítulo: `Cp`,
};
