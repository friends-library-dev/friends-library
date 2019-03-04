// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function (
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '') {
    return [];
  }

  if (line[0] !== '=' && line[0] !== '>' && line[0] !== '<') {
    return [];
  }

  if (!line.match(/^(=======|<<<<<<<|>>>>>>>)/)) {
    return [];
  }

  return [{
    line: lineNumber,
    column: false,
    type: 'error',
    rule: 'git-conflict-markers',
    message: 'Git conflict markers must be removed.',
  }];
}
