import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule } from '../types';
import RegexLintRunner from '../RegexLintRunner';

const runner = new RegexLintRunner(
  [
    {
      test: 'naylor',
      search: /\bNaylor\b/g,
      replace: 'Nayler',
      fixable: true,
      message: 'James Nayler\'s last name should always be spelled "Nayler"',
    },
    {
      test: 'pennington',
      search: /\bPennington\b/g,
      replace: 'Penington',
      fixable: true,
      message: 'Isaac Penington\'s last name should always be spelled "Penington"',
      allowIfNear: /\bSr\.|\bAlderman\b|\bFather\b|\bDaniel\b|\b(p|P)adre\b/,
    },
  ],
  { langs: ['en', 'es'] },
);

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
  lintOptions: LintOptions,
): LintResult[] => {
  return runner.getLineLintResults(line, lineNumber, lintOptions);
};

rule.slug = 'consistent-name-spelling';
runner.rule = rule.slug;

export default rule;
