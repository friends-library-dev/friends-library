import { Asciidoc, LintResult } from '@friends-library/types';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (line === '') {
    return [];
  }

  const expr = /[a-z][A-Z]([a-z]|\b)/g;
  let match;
  const results: LintResult[] = [];
  while ((match = expr.exec(line))) {
    if (isMc(match, line) || isLitV(match, line)) {
      continue;
    }

    results.push({
      line: lineNumber,
      column: match.index + 2,
      type: 'error',
      rule: rule.slug,
      message: 'Unexpected mid-word uppercase letter - likely a scan error',
    });
  }

  return results;
}

rule.slug = 'mid-word-uppercase';

function isMc(match: RegExpExecArray, line: string) {
  if (match[0][0] !== 'c') {
    return false;
  }
  return line.substr(match.index - 2, 2).match(/Ma?$/) !== null;
}

function isLitV(match: RegExpExecArray, line: string) {
  if (match[0] !== 'tV') {
    return false;
  }
  return line.substr(match.index - 3, 3).match(/\bLi$/) !== null;
}
