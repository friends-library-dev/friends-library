// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line[0] !== '[' || line[line.length - 1] !== ']') {
    return [];
  }

  if (line.indexOf('[.book-title]') !== 0) {
    return [];
  }

  return [{
    line: lineNumber,
    column: false,
    type: 'error',
    rule: rule.slug,
    message: 'Line-ending bracket needs to be escaped because the line starts with a [.book-title]',
    recommendation: line.replace(/\]$/, '+++]+++'),
  }];
}

rule.slug = 'confusing-bracket';
