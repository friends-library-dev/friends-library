import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (!line.length) {
    return [];
  }

  // prettier-ignore
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
      /( |^)(T|t) /i,
      '$1I ',
      'T/t',
      'I',
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
    [
      /\bfife\b/,
      'life',
      'fife',
      'life',
    ],
    [
      /\bFie\b/,
      'He',
      'Fie',
      'He',
    ],
    [
      /\bmc\b/,
      'me',
      'mc',
      'me'
    ],
    [
      /\b(A|a)ud\b/,
      '$1nd',
      'aud',
      'and',
    ],
    [
      /\b(s|S)ec(?!\.)\b/,
      '$1ee',
      'sec',
      'see',
    ]
  ];

  const results: LintResult[] = [];
  sets.forEach(([find, replace, err, fix, allowIfNear]) => {
    const match = line.match(find);
    if (!match || match.index === undefined) {
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
      recommendation: line.replace(find, replace as string),
      fixable: false,
    });
  });

  return results;
};

rule.slug = 'scan-errors';
export default rule;
