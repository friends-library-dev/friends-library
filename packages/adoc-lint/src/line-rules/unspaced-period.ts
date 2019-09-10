import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (line === '') {
    return [];
  }

  const expr = /\.[A-Z][^.]/g;
  let match;
  const results: LintResult[] = [];
  while ((match = expr.exec(line))) {
    results.push({
      line: lineNumber,
      column: match.index + 1,
      type: 'error',
      rule: rule.slug,
      message: 'unexpected unspaced period',
    });
  }

  return results;
};

rule.slug = 'unspaced-period';
export default rule;
