// @flow
import unicharadata from 'unicharadata';
import type { Asciidoc, LintResult } from '../../../../../type';
import gitConflictMarkers from './git-conflict-markers';

export default function rule(
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

  if (gitConflictMarkers(line, lines, lineNumber).length) {
    return [];
  }

  let escapeStart;
  let escapeEnd;
  const hasEscape = line.includes('+++');
  if (hasEscape) {
    escapeStart = line.indexOf('+++') + 3;
    escapeEnd = escapeStart + line.substring(escapeStart).indexOf('+++');
  }

  const results = [];
  line.split('').forEach((char, index) => {
    if (hasEscape && (escapeStart <= index && escapeEnd > index)) {
      return;
    }
    if (!allowed[char]) {
      const name = unicharadata.lookupname(char);
      results.push(getLint(char, line, lineNumber, index + 1, name));
    }
  });

  return results;
}

function getLint(char, line, lineNumber, column, name) {
  const hex = char.codePointAt(0).toString(16);
  const unicode = `\\u${'0000'.substring(0, 4 - hex.length)}${hex}`;
  const fixableReco = fixable(name, line, column);
  return {
    line: lineNumber,
    column,
    type: 'error',
    rule: rule.slug,
    message: `Dissallowed character: \`${char}\`, code: \`${unicode}\` (${name})`,
    ...fixableReco !== false ? { fixable: true, recommendation: fixableReco } : {},
  };
}

function fixable(name, line, column): string | false {
  switch (name) {
    case 'EN DASH':
      return line.replace(/–/g, '-');
    case 'NO-BREAK SPACE':
      return nbsp(line, column);
    case 'CYRILLIC CAPITAL LETTER O':
      return line.replace(/О/g, 'O');
    case 'BULLET':
    case 'SOFT HYPHEN':
      return `${line.substring(0, column - 1)}${line.substring(column)}`;
    case 'RIGHT SINGLE QUOTATION MARK':
      return line.replace(/’/g, "`'");
    case 'LEFT SINGLE QUOTATION MARK':
      return line.replace(/‘/g, "'`");
    case 'RIGHT DOUBLE QUOTATION MARK':
      return line.replace(/”/g, '`"');
    case 'LEFT DOUBLE QUOTATION MARK':
      return line.replace(/“/g, '"`');
    default:
      return false;
  }
}

function nbsp(line, column) {
  if (column === 1) {
    return line.replace(/^ +/, ''); // eslint-disable-line no-irregular-whitespace
  }
  if (line.substring(column - 11, column - 1) === 'footnote:[') {
    return line.replace(/footnote:\[./, 'footnote:[');
  }
  if (line[column] === ' ' || line[column - 2] === ' ') {
    return `${line.substring(0, column - 1)}${line.substring(column)}`;
  }
  return `${line.substring(0, column - 1)} ${line.substring(column)}`;
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
  // 'íéóáúñü', // spanish only
  // 'ÉÁÚ', // spanish only
  // '¡¿', // spanish only
].join('').split('').reduce((obj, char) => {
  obj[char] = true;
  return obj;
}, {});

rule.slug = 'invalid-character';
