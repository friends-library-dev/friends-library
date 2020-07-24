import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule } from '../types';
import RegexLintRunner from '../RegexLintRunner';

const runner = new RegexLintRunner([
  {
    test: `(a|p). ?m.`,
    search: /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|clock|\d),? (a|p)\. ?m\.\.?/i,
    replace: (_, prefix, aOrP) => `${prefix} ${aOrP.toLowerCase()}.m.`,
    fixable: true,
    message: `AM/PM must be formatted consistently as "a.m." and "p.m", without leading comma`,
    discardIfIdenticalRecommendation: true,
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

rule.slug = `am-pm`;
runner.rule = rule.slug;

export default rule;
