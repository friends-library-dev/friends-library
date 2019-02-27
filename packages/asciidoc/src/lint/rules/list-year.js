// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function (
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  const match = line.match(/^\* \d+\. /);
  if (!match) {
    return [];
  }

  return [{
    line: lineNumber,
    column: line.indexOf('.') + 1,
    rule: 'list-year',
    type: 'error',
    message: 'The period after a year that comes first on a _list-item line_ (begins with `*`) must be escaped.',
    recommendation: line.replace('.', '+++.+++'),
  }];
}
