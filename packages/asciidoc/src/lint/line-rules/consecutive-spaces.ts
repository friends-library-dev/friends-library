import { Asciidoc, LintResult } from '@friends-library/types';
import { isFootnotePoetryLine } from '../utils';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (line === '' || line.indexOf('  ') === -1) {
    return [];
  }

  if (isFootnotePoetryLine(line, lines, lineNumber)) {
    return [];
  }

  const expr = / {2,}/g;
  let match;
  const results: LintResult[] = [];
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

    results.push(getLint(match.index + 2, line, lineNumber));
  }
  return results;
}

function getLint(column: number, line: Asciidoc, lineNumber: number): LintResult {
  return {
    line: lineNumber,
    column,
    type: 'error',
    rule: rule.slug,
    message: 'Consecutive spaces are not allowed',
    recommendation: line.replace(/ {2,}/g, ' '),
    fixable: true,
  };
}

rule.slug = 'consecutive-spaces';
