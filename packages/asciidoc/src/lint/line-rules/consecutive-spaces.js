// @flow
import type { Asciidoc, LintResult } from '../../../../../type';
import { isFootnotePoetryLine } from './leading-whitespace';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '' || line.indexOf('  ') === -1) {
    return [];
  }

  if (isFootnotePoetryLine(line, lines, lineNumber)) {
    return [];
  }

  const expr = / {2,}/g;
  let match;
  const results = [];
  while ((match = expr.exec(line))) {
    const isLeading = match.index === 0;
    const isTrailing = match.index + match[0].length === line.length;
    if (isLeading || isTrailing) {
      continue;
    }

    // will be caught by `invalid-heading` rule
    if (results.length === 0 && line.substring(0, match.index + 1).match(/^===?=? $/)) {
      continue;
    }

    results.push(getLint(match, line, lineNumber));
  }
  return results;
}

function getLint(match, line, lineNumber) {
  return {
    line: lineNumber,
    column: match.index + 2,
    type: 'error',
    rule: rule.slug,
    message: 'Consecutive spaces are not allowed',
    recommendation: line.replace(/ {2,}/g, ' '),
    fixable: true,
  };
}

rule.slug = 'consecutive-spaces';
