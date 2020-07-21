import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule } from '../types';
import RegexLintRunner from '../RegexLintRunner';

const runner = new RegexLintRunner(
  [
    {
      test: `mary`,
      search: /\bMary Ridgeway\b/g,
      replace: `Mary Ridgway`,
      fixable: (_: any, line: string) => line.includes(`Mary Ridgeway`),
      message: `Mary Ridgway must always be spelled without an E`,
      includeNextLineFirstWord: true,
    },
    {
      test: `catharine`,
      search: /\bCatharine Payton\b/g,
      replace: `Catherine Payton`,
      fixable: (_: any, line: string) => line.includes(`Catharine Payton`),
      message: `Catherine Payton must always be spelled with an E: Cath**E**rine`,
      includeNextLineFirstWord: true,
    },
    {
      test: `naylor`,
      search: /\bNaylor\b/g,
      replace: `Nayler`,
      fixable: true,
      message: `James Nayler's last name must always be spelled "Nayler"`,
    },
    {
      test: `pennington`,
      search: /\bPennington\b/g,
      replace: `Penington`,
      fixable: true,
      message: `Isaac Penington's last name must always be spelled "Penington"`,
      allowIfNear: /\bSr\.|\bAlderman\b|\bFather\b|\bDaniel\b|\b(p|P)adre\b/,
    },
  ],
  { langs: [`en`, `es`] },
);

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
  lintOptions: LintOptions,
): LintResult[] => {
  return runner.getLineLintResults(line, lineNumber, lines, lintOptions);
};

rule.slug = `consistent-name-spelling`;
runner.rule = rule.slug;

export default rule;
