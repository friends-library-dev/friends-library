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

  const doubles = [
    "`'`'",
    "'`'`",
    '`"`"',
    '"`"`',
    ',,',
    ';;',
    '??',
  ];

  const lints = [];
  doubles.forEach(double => {
    if (!line.includes(double)) {
      return;
    }
    for (let i = 0; i < line.length; i++) {
      if (line.substring(i, i + double.length) === double) {
        lints.push(getLint(line, lineNumber, double, i));
      }
    }
  });

  return lints;
}

function getLint(
  line: Asciidoc,
  lineNumber: number,
  double: string,
  colIndex: number,
): LintResult {
  const before = line.substring(0, colIndex);
  const after = line.substring(colIndex + double.length);
  const single = double.substring(0, double.length / 2);
  const recommendation = `${before}${single}${after}`;
  return {
    line: lineNumber,
    column: colIndex + 1 + (double.length / 2),
    type: 'error',
    rule: 'doubled-punctuation',
    message: 'Invalid doubled punctuation mark',
    recommendation,
    fixable: double.length === 2,
  };
}
