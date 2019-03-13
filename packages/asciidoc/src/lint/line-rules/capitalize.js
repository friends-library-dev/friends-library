// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '' || line.length < 5) {
    return [];
  }

  const words = [
    ['satan', 'Satan'],
  ];

  const results = [];
  words.forEach(([lower, corrected]) => {
    const find = new RegExp(`\\b${lower}\\b`, 'g');
    const match = line.match(find);
    if (match) {
      results.push({
        line: lineNumber,
        column: line.indexOf(lower) + 1,
        type: 'error',
        rule: rule.slug,
        fixable: true,
        message: `"${corrected}" should be capitalized everywhere in all editions`,
        recommendation: line.replace(find, corrected),
      });
    }
  });

  return results;
}

rule.slug = 'capitalize';
