import { Asciidoc, LintResult } from '@friends-library/types';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (line === '') {
    return [];
  }

  const expr = /\.[A-Z][^\.]/g;
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
}

rule.slug = 'unspaced-period';
