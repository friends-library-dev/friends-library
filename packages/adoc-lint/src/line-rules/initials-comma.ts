import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule } from '../types';
import RegexLintRunner from '../RegexLintRunner';

const runner = new RegexLintRunner([
  {
    test: `,`,
    search: /\b([A-Z]), ?([A-Z])\./g,
    replace: `$1. $2.`,
    fixable: true,
    allowIfNear: /I, A\. ?B\./,
    message: `unexpected comma in initials must be removed`,
  },
  {
    test: `,`,
    search: /\b([A-Z])\. ?([A-Z]),/g,
    replace: `$1. $2.,`,
    fixable: true,
    allowIfNear: /I, A\. ?B\./,
    message: `unexpected comma in initials must be removed`,
  },
]);

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
  lintOptions: LintOptions,
): LintResult[] => {
  if (lintOptions.lang !== `en`) {
    return [];
  }
  return runner.getLineLintResults(line, lineNumber, lines, lintOptions);
};

rule.slug = `initials-comma`;
runner.rule = rule.slug;

export default rule;
