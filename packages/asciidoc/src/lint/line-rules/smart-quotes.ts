import { Asciidoc, LintResult } from '@friends-library/types';
import { quotifyLine } from '../../quotify';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  const fixed = quotifyLine(line);
  if (fixed === line) {
    return [];
  }

  let column: number | null = null;
  line.split('').forEach((char, col) => {
    if (column === null && char !== fixed[col]) {
      column = col;
    }
  });

  return [
    {
      line: lineNumber,
      type: 'error',
      column: column || 0,
      rule: rule.slug,
      message: 'Incorrect usage of smart quotes/apostrophes',
      recommendation: fixed,
      fixable: true,
    },
  ];
}

rule.slug = 'smart-quotes';
