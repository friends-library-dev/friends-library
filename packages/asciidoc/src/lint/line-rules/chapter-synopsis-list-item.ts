import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (line[0] !== '[' || line[1] !== '.' || line[line.length - 1] !== ']') {
    return [];
  }

  if (!line.includes('.chapter-synopsis')) {
    return [];
  }

  let index = lineNumber;
  let nextLine = lines[index];

  const results: LintResult[] = [];
  while (nextLine) {
    if (!nextLine.match(/^\* [^ ]/) && !nextLine.match(/^\/\//)) {
      results.push({
        line: index + 1,
        column: 1,
        type: 'error',
        rule: rule.slug,
        message: 'Chapter synopsis list items must begin with exactly `* `',
        recommendation: nextLine
          .replace(/^\*+/, '')
          .replace(/^ +/, '')
          .replace(/^/, '* '),
        fixable: false,
      });
    }
    index++;
    nextLine = lines[index];
  }

  return results;
};

rule.slug = 'chapter-synopsis-list-item';
export default rule;
