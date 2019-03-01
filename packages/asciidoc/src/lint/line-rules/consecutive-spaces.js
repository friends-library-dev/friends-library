// @flow
import type { Asciidoc, LintResult } from '../../../../../type';
import { isFootnotePoetryLine } from './leading-whitespace';

export default function (
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '' || line.indexOf('  ') === -1) {
    return [];
  }

  const match = line.match(/ {2,100}/);
  if (!match) {
    return [];
  }

  if (isFootnotePoetryLine(line, lines, lineNumber)) {
    return [];
  }

  return [{
    line: lineNumber,
    column: match.index + 2,
    type: 'error',
    rule: 'consecutive-spaces',
    message: 'Consecutive spaces are not allowed',
    recommendation: line.replace(/ {2,100}/g, ' '),
    fixable: true,
  }];
}
