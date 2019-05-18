import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
  { lang, editionType, maybe }: LintOptions,
): LintResult[] => {
  if (lang === 'es' || editionType !== 'modernized' || line === '') {
    return [];
  }

  // prettier-ignore
  const words: [RegExp, string, string, string, boolean, boolean][] = [
    [
      /\b(A|a)mongst\b/g,
      'amongst',
      'among',
      '$1mong',
      FIXABLE,
      ALWAYS,
    ],
    [
      /\bZionward(s?)\b/g,
      'Zionward',
      'towards Zion',
      'towards Zion',
      NOT_FIXABLE,
      MAYBE,
    ]
  ];

  const results: LintResult[] = [];
  words.forEach(([pattern, archaic, updated, replace, fixable, onlyMaybe]) => {
    if (onlyMaybe === true && maybe !== true) {
      return;
    }

    const match = line.match(pattern);
    const action = onlyMaybe
      ? 'is often (but not always!) better'
      : 'should be replaced with';
    if (match) {
      results.push({
        line: lineNumber,
        column: line.indexOf(match[0]) + 1,
        type: 'error',
        rule: rule.slug,
        fixable,
        message: `"${archaic}" ${action} "${updated}" in modernized editions`,
        recommendation: line.replace(pattern, replace),
      });
    }
  });

  return results;
};

rule.slug = 'modernize-words';
export default rule;

const FIXABLE = true;
const NOT_FIXABLE = false;
const MAYBE = true;
const ALWAYS = false;
