import { Asciidoc, LintResult } from '@friends-library/types';
import { toArabic } from 'roman-numerals';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (line === ``) {
    return [];
  }

  const doubles = [
    `\`'\`'`,
    `'\`'\``,
    `\`"\`"`,
    `"\`"\``,
    `,,`,
    `;;`,
    `??`,
    `.,`,
    `,.`,
    `:.`,
    `.:`,
    `.;`,
    `;.`,
    `!.`,
    `.!`,
  ];

  const lints: LintResult[] = [];
  doubles.forEach(double => {
    if (!line.includes(double)) {
      return;
    }
    for (let i = 0; i < line.length; i++) {
      if (
        line.substring(i, i + double.length) === double &&
        !specialCase(double, line, i)
      ) {
        lints.push(getLint(line, lineNumber, double, i));
      }
    }
  });

  return lints;
};

function specialCase(double: string, line: string, column: number): boolean {
  if (![`.,`, `.:`, `.;`, `.!`].includes(double)) {
    return false;
  }

  if (line[column - 1] && line[column - 1].match(/\d/)) {
    return true;
  }

  const two = line.substring(column - 2, column).toLowerCase();
  const allowedTwo = [`jr`, `sr`, `mo`, `ii`, `co`, `pa`, `pp`];
  if (two.length === 2 && allowedTwo.includes(two)) {
    return true;
  }

  // prettier-ignore
  const allowedThree = [
    `etc`, `viz`, `ult`, `jun`, `vol`, `4to`, `i.e`, `esq`, `1st`,
    `2nd`, `3rd`, `4th`, `5th`, `6th`, `7th`, `8th`, `9th`, `p.m`,
    `a.m`, `sen`, `pet`, `jan`, `feb`, `mar`, `apr`, `jul`, `aug`,
    `sep`, `oct`, `nov`, `dec`, `m.d`,
  ];
  const three = line.substring(column - 3, column).toLowerCase();
  if (three.length === 3 && allowedThree.includes(three)) {
    return true;
  }

  // prettier-ignore
  const allowedFour = [
    `vols`, `ibid`, `i. e`, `inst`, `mass`, `p. m`, `a. m`,
    `matt`, `chap`, `faht`,
  ];
  const four = line.substring(column - 4, column).toLowerCase();
  if (four.length === 4 && allowedFour.includes(four)) {
    return true;
  }

  // special case `G. F., and F. H. went to meeting`
  if (
    column >= 1 &&
    line[column] === `.` &&
    line[column - 1].match(/[A-Z]/) &&
    (column === 1 || line[column - 2] === ` `)
  ) {
    return true;
  }

  if (three === `\`'s` && four[0] && line[column - 4].match(/[A-Z]/)) {
    return true;
  }

  // catch roman numerals
  const lastWord = line
    .substring(0, column)
    .split(` `)
    .pop();

  try {
    const num = toArabic(lastWord || ``);
    if (typeof num === `number`) {
      return true;
    }
  } catch (e) {
    // ¯\_(ツ)_/¯
  }

  // shillings refs
  if (two.match(/^\ds$/)) {
    return true;
  }

  // definition lists
  if (double === `.:` && line[column + 1] === `:`) {
    return true;
  }

  return false;
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
  const lint: LintResult = {
    line: lineNumber,
    column: colIndex + 1 + double.length / 2,
    type: `error`,
    rule: rule.slug,
    message: `Invalid doubled punctuation mark`,
    recommendation,
    fixable: double.length === 2,
  };

  if (double.length === 2 && double[0] !== double[1]) {
    delete lint.recommendation;
    delete lint.fixable;
  }

  return lint;
}

rule.slug = `doubled-punctuation`;
export default rule;
