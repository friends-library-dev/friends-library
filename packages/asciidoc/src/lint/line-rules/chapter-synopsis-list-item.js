// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line[0] !== '[' || line[1] !== '.' || line[line.length - 1] !== ']') {
    return [];
  }

  if (!line.includes('.chapter-synopsis')) {
    return [];
  }

  let index = lineNumber;
  let nextLine = lines[index];

  const results = [];
  while (nextLine) {
    if (!nextLine.match(/^\* [^ ]/)) {
      results.push({
        line: index + 1,
        column: 1,
        type: 'error',
        rule: rule.slug,
        message: 'Chapter synopsis list items must begin with exactly `* `',
        recommendation: nextLine.replace(/^\*+/, '').replace(/^ +/, '').replace(/^/, '* '),
        fixable: true,
      });
    }
    index++;
    nextLine = lines[index];
  }

  return results;
}

rule.slug = 'chapter-synopsis-list-item';
