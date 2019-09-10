import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (!line.length || line[line.length - 1] !== ' ') {
    return [];
  }

  const match = line.match(/ +$/);
  if (!match || match.index === undefined) {
    return [];
  }

  return [
    {
      line: lineNumber,
      column: match.index + 1,
      rule: rule.slug,
      type: 'error',
      message: 'Lines should not have trailing whitespace',
      recommendation: line.replace(/ +$/, ''),
      fixable: true,
    },
  ];
};

rule.slug = 'trailing-whitespace';
export default rule;
