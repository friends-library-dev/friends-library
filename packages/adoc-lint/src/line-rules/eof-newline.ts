import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (line === `` || lineNumber !== lines.length) {
    return [];
  }

  return [
    {
      line: lineNumber,
      column: false,
      type: `error`,
      rule: rule.slug,
      message: `Files must end with a single blank line`,
      fixable: true,
      recommendation: `--> add a new line to the end of the file`,
    },
  ];
};

rule.slug = `eof-newline`;
export default rule;
