import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule } from '../types';
import RegexLintRunner from '../RegexLintRunner';

const runner = new RegexLintRunner(
  [
    {
      test: `ing`,
      search: /([^A-Za-z]+)\bing\b/,
      replace: (full: string, prev: string) => {
        return full.replace(prev, ``);
      },
      fixable: true,
    },
    {
      test: `f`,
      search: /( |^)(F|f) /g,
      replace: `$1I `,
    },
    {
      test: `mmd`,
      search: /\bmmd\b/g,
      replace: `mind`,
    },
    {
      test: `lime|limes`, // --> time/s
      search: /\blime(s)?\b/g,
      replace: `time$1`,
      allowIfNear: /(lemon|orange|kiln|fruit|manure|white|stone|juice|chloride)/i,
    },
    {
      test: `wc`, // --> we
      search: /\b(W|w)c\b/g,
      replace: `$1e`,
    },
    {
      test: `whoso`, // --> whose
      search: /\b(W|w)hoso\b/g,
      replace: `$1hose`,
      message: `"whoso" is sometimes a scan error of "whose" except when it is a synonym for "whoever"`,
      editions: [`original` as const],
      isMaybe: true,
    },
    {
      test: `bo`, // --> be
      search: /\b(B|b)o\b/g,
      replace: `$1e`,
    },
    {
      test: `T`, // --> I
      search: /( |^)(T|t) /g,
      replace: `$1I `,
    },
    {
      test: `ray`, // --> my
      search: /\bray\b/g,
      replace: `my`,
      allowIfNear: /\b(ray of|gloom|sun|shone)\b/i,
    },
    {
      test: `arid`, // --> and
      search: /\b(A|a)rid\b/g,
      replace: `$1nd`,
      allowIfNear: /\b(dry|desert|parch)/i,
    },
    {
      test: `arc`, // --> are
      search: /\b(A|a)rc\b/g,
      replace: `$1re`,
      allowIfNear: /\b(joan|jeanne)\b/i,
    },
    {
      test: `fife`, // --> life
      search: /\bfife\b/g,
      replace: `life`,
      allowIfNear: /\bfiddle\b|\bplay/i,
    },
    {
      test: `Fie`, // --> He
      search: /\bFie\b/g,
      replace: `He`,
    },
    {
      test: `sec`, // --> see
      search: /\b(S|s)ec(?!\.)\b/g,
      replace: `$1ee`,
    },
    {
      test: `aud`, // --> and
      search: /\b(A|a)ud\b/g,
      replace: `$1nd`,
    },
    {
      test: `mc`, // --> me
      search: /\bmc\b/g,
      replace: `me`,
    },
  ].map(d => ({ ...d, test: `\\b${d.test}\\b` })),
  {
    fixable: false,
    message: `"<found>" is often a scanning error and should be corrected to "<fixed>"`,
  },
);

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
  lintOptions: LintOptions,
): LintResult[] => {
  if (lintOptions.lang !== `en`) {
    return [];
  }
  return runner.getLineLintResults(line, lineNumber, lintOptions);
};

rule.slug = `scan-errors`;
runner.rule = rule.slug;

export default rule;
