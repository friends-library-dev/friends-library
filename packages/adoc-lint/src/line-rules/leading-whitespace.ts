import { Asciidoc, LintResult } from '@friends-library/types';
import { isFootnotePoetryLine } from '../utils';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (!line.length || line[0] !== ' ') {
    return [];
  }

  if (isFootnotePoetryLine(line, lines, lineNumber)) {
    return [];
  }

  return [
    {
      line: lineNumber,
      column: 0,
      rule: rule.slug,
      type: 'error',
      message: 'Lines should not have leading whitespace',
      recommendation: line.replace(/^ +/, ''),
      fixable: true,
    },
  ];
};

rule.slug = 'leading-whitespace';
export default rule;
