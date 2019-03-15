import { Asciidoc, LintResult } from '@friends-library/types';
import { match } from 'minimatch';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (line === '') {
    return [];
  }

  const match = line.match(/^(\d+||[a-z]{1})\. /i);
  if (!match || match.index === undefined) {
    return [];
  }

  return [
    {
      line: lineNumber,
      column: match.index + 2,
      rule: rule.slug,
      type: 'error',
      message:
        'Periods near the beginning of the line sometimes need to be escaped to prevent errors converting to HTML.',
      recommendation: line.replace(/\./, '+++.+++'),
    },
  ];
}

rule.slug = 'unintentional-list-item';
