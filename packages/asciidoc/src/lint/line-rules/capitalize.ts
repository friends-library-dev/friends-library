import { Asciidoc, LintResult } from '@friends-library/types';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (line === '' || line.length < 5) {
    return [];
  }

  // prettier-ignore
  const words = [
    ['satan', 'Satan'],
  ];

  const results: LintResult[] = [];
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
