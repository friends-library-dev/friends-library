import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (line === `'''` && lines[lineNumber] !== ``) {
    return [
      {
        line: lineNumber,
        column: false,
        type: `error`,
        rule: rule.slug,
        message: `This type of markup must be followed by an empty line`,
        fixable: true,
        recommendation: `--> add an empty line after line ${lineNumber}`,
      },
    ];
  }

  return [];
};

rule.slug = `unspaced-markup`;

export default rule;
