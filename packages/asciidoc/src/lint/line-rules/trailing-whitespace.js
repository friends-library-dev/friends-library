// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (!line.length || line[line.length - 1] !== ' ') {
    return [];
  }

  return [{
    line: lineNumber,
    column: (line.match(/ +$/) || { index: -1 }).index + 1,
    rule: rule.slug,
    type: 'error',
    message: 'Lines should not have trailing whitespace',
    recommendation: line.replace(/ +$/, ''),
    fixable: true,
  }];
}

rule.slug = 'trailing-whitespace';
