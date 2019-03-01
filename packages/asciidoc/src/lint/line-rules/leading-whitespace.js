// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function (
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (!line.length || line[0] !== ' ') {
    return [];
  }

  if (isFootnotePoetryLine(line, lines, lineNumber)) {
    return [];
  }

  return [{
    line: lineNumber,
    column: 0,
    rule: 'leading-whitespace',
    type: 'error',
    message: 'Lines should not have leading whitespace',
    recommendation: line.replace(/^ +/, ''),
  }];
}

export function isFootnotePoetryLine(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  number: number,
): boolean {
  if (line.match(/^` {4}/)) {
    return true;
  }

  if (!line.match(/^(\s){5}/)) {
    return false;
  }

  if (!lines[number - 2]) {
    return false;
  }
  let index = number - 2;
  let prevLine = lines[index];
  while (prevLine) {
    // this special line starts footnote poetry
    if (prevLine.match(/^`(\s){4}/)) {
      return true;
    }

    // means we've moved up INTO a footnote, so were not in one before
    if (prevLine.match(/\]$/)) {
      return false;
    }

    // we're exiting a footnote, and didn't fine the special starter line
    if (prevLine.match(/footnote:\[/)) {
      return false;
    }

    index -= 1;
    prevLine = lines[index];
  }

  return false;
}
