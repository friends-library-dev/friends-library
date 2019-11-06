import { toRoman } from 'roman-numerals';

export function addVolumeSuffix(str: string, volIdx?: number): string {
  if (typeof volIdx === 'number') {
    return `${str} &#8212; Vol. ${toRoman(volIdx + 1)}`;
  }
  return str;
}
