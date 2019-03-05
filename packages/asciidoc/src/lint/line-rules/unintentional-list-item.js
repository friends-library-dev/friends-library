// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (!line.match(/^(\d+||[a-z]{1})\. /i)) {
    return [];
  }

  return [{
    line: lineNumber,
    column: (line.match(/\./) || { index: -1 }).index + 1,
    rule: rule.slug,
    type: 'error',
    message: 'Periods near the beginning of the line sometimes need to be escaped to prevent errors converting to HTML.',
    recommendation: line.replace(/\./, '+++.+++'),
  }];
}

rule.slug = 'unintentional-list-item';
