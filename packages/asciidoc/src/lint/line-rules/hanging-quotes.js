// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function (
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '' || line.length < 4) {
    return [];
  }

  if (line[line.length - 3] !== ' ') {
    return [];
  }

  if (!line.match(/ ("`|`"|'`|`')$/)) {
    return [];
  }

  return [{
    line: lineNumber,
    column: line.length - 1,
    type: 'error',
    rule: 'hanging-quotes',
    message: 'Invalid hanging quotation. Perhaps move it to the next line?',
  }];
}
