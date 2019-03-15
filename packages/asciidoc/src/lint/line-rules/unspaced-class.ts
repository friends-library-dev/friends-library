import { Asciidoc, LintResult } from '@friends-library/types';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (
    line === '' ||
    line[0] !== '[' ||
    line[line.length - 1] !== ']' ||
    lineNumber === 1
  ) {
    return [];
  }

  if (lines[lineNumber - 2] === '') {
    return [];
  }

  return [
    {
      line: lineNumber,
      column: false,
      type: 'error',
      rule: rule.slug,
      message:
        'Class/id designations (like `[.something]`) must be preceded by an empty line',
      fixable: true,
      recommendation: `--> add an empty line before line ${lineNumber}`,
    },
  ];
}

rule.slug = 'unspaced-class';
