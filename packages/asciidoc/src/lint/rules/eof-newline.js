// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function (
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '' || lineNumber !== lines.length) {
    return [];
  }

  return [{
    line: lineNumber,
    column: false,
    type: 'error',
    rule: 'eof-newline',
    message: 'Files must end with a single blank line',
  }];
}
