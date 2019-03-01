// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function (
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '' || lines[lineNumber] !== '') {
    return [];
  }

  if (line[0] !== '[' || line[line.length - 1] !== ']') {
    return [];
  }

  return [{
    line: lineNumber,
    column: false,
    type: 'error',
    rule: 'floating-class',
    message: 'Class/id designations (like `[.something]`) may not be followed by an empty line',
  }];
}
