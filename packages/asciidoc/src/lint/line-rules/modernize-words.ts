import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
  { lang, editionType }: LintOptions,
): LintResult[] => {
  if (lang === 'es' || editionType !== 'modernized' || line === '') {
    return [];
  }

  // prettier-ignore
  const words: [RegExp, string, string, string][] = [
    [
      /\b(A|a)mongst\b/g,
      'amongst',
      'among',
      '$1mong',
    ],
  ];

  const results: LintResult[] = [];
  words.forEach(([pattern, archaic, updated, replace]) => {
    const match = line.match(pattern);
    if (match) {
      results.push({
        line: lineNumber,
        column: line.indexOf(match[0]) + 1,
        type: 'error',
        rule: rule.slug,
        fixable: true,
        message: `"${archaic}" should be replaced with "${updated}" in modernized editions`,
        recommendation: line.replace(pattern, replace),
      });
    }
  });

  return results;
};

rule.slug = 'modernize-words';
export default rule;
