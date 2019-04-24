import { Ref } from './find';
import { toNumber } from './convert';

// @TODO duplication...
const ARAB = '[\\d]{1,3}';
const ADD = `(?:, ?(${ARAB}))?`;
const CSV = `${ADD}${ADD}${ADD}${ADD}${ADD}${ADD}`;

function exec(str: string, pattern: string): RegExpExecArray | null {
  const exp = new RegExp(pattern);
  return exp.exec(str);
}

function singleOrRange(
  pattern: string,
  start: number,
  context: string,
  ref: Ref,
  chapter: number,
): Ref {
  const match = exec(context, pattern);
  if (!match) {
    return ref;
  }

  const [versesSubString, verseStart, verseEnd] = match;
  ref.verses.push({
    chapter,
    verse: toNumber(verseStart),
  });

  let next = toNumber(verseStart) + 1;
  while (verseEnd && next <= toNumber(verseEnd)) {
    ref.verses.push({
      chapter,
      verse: toNumber(next),
    });
    next++;
  }

  ref.position.end = start + versesSubString.length;
  return ref;
}

function comma(
  pattern: string,
  start: number,
  context: string,
  ref: Ref,
  chapter: number,
): Ref {
  const match = exec(context, pattern);
  if (!match) {
    return ref;
  }

  const verseNumbers = match
    .slice(1, 10)
    .filter(v => !!v)
    .map(v => parseInt(v, 10))
    .sort();

  ref.position.end = start + match[0].length;

  let last = 0;
  verseNumbers.forEach(current => {
    if (last && current - last > 1) {
      ref.contiguous = false;
    }

    ref.verses.push({
      chapter,
      verse: current,
    });

    last = current;
  });
  return ref;
}

// 1 Cor. 1. 24 | 1 Cor. 1. 24--27
export function romanSingleOrRange(
  start: number,
  context: string,
  ref: Ref,
  chapter: number,
): Ref {
  const pattern = `^\\. (${ARAB})(?:-+(${ARAB}))?`;
  return singleOrRange(pattern, start, context, ref, chapter);
}

// 1 Cor. 1. 24, 25
export function romanComma(
  start: number,
  context: string,
  ref: Ref,
  chapter: number,
): Ref {
  const pattern = `^\\. (${ARAB}),(?: )?(${ARAB})${CSV}`;
  return comma(pattern, start, context, ref, chapter);
}

// 1 Cor. 1:24,27
export function colonComma(
  start: number,
  context: string,
  ref: Ref,
  chapter: number,
): Ref {
  const pattern = `^:(${ARAB}),(?: )?(${ARAB})${CSV}`;
  return comma(pattern, start, context, ref, chapter);
}

// 1 Cor. 1:24 | 1 Cor. 1:24-29
export function colonSingleOrRange(
  start: number,
  context: string,
  ref: Ref,
  chapter: number,
): Ref {
  const pattern = `^:(${ARAB})(?:-+(${ARAB}))?`;
  return singleOrRange(pattern, start, context, ref, chapter);
}
