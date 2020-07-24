import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule } from '../types';
import RegexLintRunner from '../RegexLintRunner';

const runner = new RegexLintRunner([
  {
    test: `etc`,
    search: /\betc,(:|;)?/g,
    replace: (_, end) => (end === undefined ? `etc.,` : `etc.${end}`),
    fixable: true,
    message: `The abbreviation "etc." must always have an ending period`,
  },
  {
    test: `etc`,
    search: /\betc([^.,]|$)/g,
    replace: `etc.$1`,
    fixable: true,
    message: `The abbreviation "etc." must always have an ending period`,
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

rule.slug = `etc-period`;
runner.rule = rule.slug;

export default rule;
