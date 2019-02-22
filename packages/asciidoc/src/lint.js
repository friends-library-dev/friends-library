// @flow
import type { Asciidoc } from '../../../type';
import type { LintResult } from '../type.js.flow';
import { quotifyLine } from './quotify';

export default function lint(adoc: Asciidoc): Array<LintResult> {
  const rules = [smartQuotes];
  const lines = adoc.split('\n');
  return lines.reduce((acc, line, index) => {
    let lineResults = [];
    rules.forEach(rule => {
      lineResults = [...lineResults, ...rule(line, lines, index + 1)];
    });
    return acc.concat(acc, lineResults);
  }, []);
}


function smartQuotes(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  const fixed = quotifyLine(line);
  if (fixed === line) {
    return [];
  }

  let column = null;
  line.split('').forEach((char, col) => {
    if (column === null && char !== fixed[col]) {
      column = col;
    }
  });

  return [{
    line: lineNumber,
    type: 'error',
    column: column || 0,
    rule: 'smart-quotes',
    message: 'Incorrect usage of smart quotes/apostrophes',
    recommendation: fixed,
  }];
}
