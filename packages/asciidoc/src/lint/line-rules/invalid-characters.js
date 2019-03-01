// @flow
import unicharadata from 'unicharadata';
import type { Asciidoc, LintResult } from '../../../../../type';

export default function (
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '') {
    return [];
  }

  if (isSuppressed(lines, lineNumber)) {
    return [];
  }

  const results = [];
  line.split('').forEach((char, index) => {
    if (!allowed[char]) {
      results.push(getLint(char, lineNumber, index + 1));
    }
  });

  return results;
}

function getLint(char, line, column) {
  const hex = char.codePointAt(0).toString(16);
  const unicode = `\\u${'0000'.substring(0, 4 - hex.length)}${hex}`;
  return {
    line,
    column,
    type: 'error',
    rule: 'invalid-character',
    message: `Dissallowed character: \`${char}\`, code: \`${unicode}\` (${unicharadata.lookupname(char)})`,
  };
}

function isSuppressed(lines: Array<Asciidoc>, lineNumber: number): boolean {
  const prevLine = lines[lineNumber - 2];
  if (!prevLine || prevLine[0] !== '/') {
    return false;
  }
  return !!prevLine.match(/^\/\/ lint-disable .*invalid-character/);
}

// performance sort of matters here, because we're checking every character
// of sometimes every book -- using object property lookup was about 25%
// faster than using Set.has(x), in my testing, and WAY faster than [].includes(x)
const allowed = [
  'abcdefghijklmnopqrstuvwxyz',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '01234567890',
  '.,;:!?',
  '"\'`',
  '£$',
  '[]#%^&*()-_=+\\/{}°',
  '\n ',
].join('').split('').reduce((obj, char) => {
  obj[char] = true;
  return obj;
}, {});
