import { Heading } from '@friends-library/types';
import { trimTrailingPunctuation } from './helpers';
import { toRoman } from 'roman-numerals';

export function navText({
  text,
  shortText,
  sequence,
}: Pick<Heading, 'text' | 'shortText' | 'sequence'>): string {
  const mainText = trimTrailingPunctuation(shortText || text).replace(/ \/ .+/, ``);
  if (!sequence) {
    return mainText;
  }

  return `${sequence.type} ${toRoman(sequence.number)}${
    mainText ? ` &#8212; ${mainText}` : ``
  }`;
}
