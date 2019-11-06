import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (line === '' || !line.includes('undefined')) {
    return [];
  }

  const column = line.indexOf('undefined') + 1;

  return [
    {
      line: lineNumber,
      column,
      type: 'error',
      rule: rule.slug,
      message: '`undefined` is usually a scripting error artifact and should be removed',
      fixable: false,
    },
  ];
};

rule.slug = 'no-undefined';
export default rule;
