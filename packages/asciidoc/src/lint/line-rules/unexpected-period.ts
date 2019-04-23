import { Asciidoc, LintResult } from '@friends-library/types';
import { toArabic } from 'roman-numerals';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (line === '') {
    return [];
  }

  const expr = /[a-z]\.(?<!\betc\.)(?<!\bviz\.)(?<!\b(V|v)ol\.)(?<!\bch\.)(?<!\b8vo\.)(?<!\bfol\.)(?<!\bsect\.)(?<!\bedit\.)(?<!\b\d+(d|s)\.)(?<!\bchap\.)(?<!\bp\.) [a-z]/g;

  let match;
  const results: LintResult[] = [];
  while ((match = expr.exec(line))) {
    if (isIe(match, line) || isPmOrAm(match, line) || isRomanNumeral(match, line)) {
      continue;
    }

    results.push({
      line: lineNumber,
      column: match.index + 2,
      type: 'error',
      rule: rule.slug,
      message: 'Unexpected period',
    });
  }

  return results;
}

rule.slug = 'unexpected-period';
rule.maybe = true;

function isRomanNumeral(match: RegExpExecArray, line: string): boolean {
  const lastWord = line
    .substring(0, match.index)
    .split(' ')
    .pop();

  try {
    const num = toArabic(lastWord || '');
    if (typeof num === 'number') {
      return true;
    }
  } catch {}

  return false;
}

function isIe(match: RegExpExecArray, line: string): boolean {
  const firstLetter = match[0][0];
  if (firstLetter === 'i') {
    return !!match[0].match(/i\. ?e/);
  }

  if (firstLetter !== 'e') {
    return false;
  }

  return !!previousCharacters(line, match, 9).match(/i\+?\+?\+?\.\+?\+?\+? ?/);
}

function isPmOrAm(match: RegExpExecArray, line: string): boolean {
  const firstLetter = match[0][0].toLowerCase();
  if (['a', 'p'].includes(firstLetter)) {
    return !!match[0].match(/(p|a)\. ?m/i);
  }

  if (firstLetter !== 'm') {
    return false;
  }

  return !!previousCharacters(line, match, 3).match(/(a|p)\. ?/i);
}

function previousCharacters(
  line: string,
  match: RegExpExecArray,
  number: number,
): string {
  return line.substr(Math.max(match.index - number, 0), Math.min(match.index, number));
}
