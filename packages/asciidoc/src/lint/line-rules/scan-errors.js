// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (!line.length) {
    return [];
  }

  const sets = [
    [
      /\blime(s)?\b/,
      'time$1',
      'lime/s',
      'time/s',
      /(lemon|orange|kiln|fruit|manure|white|stone|juice|chloride)/i,
    ],
    [
      /\b(w)c\b/i,
      '$1e',
      'wc',
      'we',
    ],
    [
      /\b(b)o\b/i,
      '$1e',
      'bo',
      'be',
    ],
    [
      /\b(r)ay\b/,
      'my',
      'ray',
      'my',
      /(ray of|gloom|sun)/,
    ],
    [
      /\b(a)rid\b/i,
      '$1nd',
      'arid',
      'and',
      /dry|desert|parch/i,
    ],
    [
      /\b(a)rc\b/i,
      '$1re',
      'arc',
      'are',
      /joan|jeanne/i,
    ],
  ];

  const results = [];
  sets.forEach(([find, replace, err, fix, allowIfNear]) => {
    const match = line.match(find);
    if (!match) {
      return;
    }
    if (allowIfNear instanceof RegExp && line.match(allowIfNear)) {
      return;
    }
    results.push({
      line: lineNumber,
      column: match.index + 1,
      rule: rule.slug,
      type: 'error',
      message: `"${err}" is often a scanning error and should be corrected to "${fix}"`,
      recommendation: line.replace(find, replace),
      fixable: false,
    });
  });

  return results;
}

rule.slug = 'scan-errors';
