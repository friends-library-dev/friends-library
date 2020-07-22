import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule } from '../types';
import RegexLintRunner from '../RegexLintRunner';

const runner = new RegexLintRunner(
  [
    {
      test: `yesternight`,
      search: /\b(Y|y)esternight\b/g,
      replace: (_, y) => `${y === `Y` ? `L` : `l`}ast night`,
      fixable: true,
    },
    {
      test: `imprest`,
      search: /\b(I|i)mprest\b/g,
      message: `imprest should be replaced in modernized editions (imprinted, stamped, fixed in the mind, convinced)`,
      replace: `$1mprinted`,
      fixable: false,
    },
    {
      test: `esp`,
      search: /\b(E|e)sp(y|ied)\b/g,
      message: `espy should be replaced in modernized editions (catch sight of, notice, spot, discover)`,
      fixable: false,
    },
    {
      test: `amongst`,
      search: /\b(A|a)mongst\b/g,
      replace: `$1mong`,
      fixable: true,
    },
    {
      test: `spake`,
      search: /\b(S|s)pake\b/g,
      replace: `$1poke`,
      fixable: true,
    },
    {
      test: `methinks`,
      search: /\b(M|m)ethinks\b/g,
      replace: `I think`,
      fixable: true,
    },
    {
      test: `methought`,
      search: /\b(M|m)ethought\b/g,
      replace: `I thought`,
      fixable: true,
    },
    {
      test: `whoso`,
      search: /\b(W|w)hoso\b/g,
      replace: `$1hoever`,
      fixable: false,
    },
    {
      test: `zionward`,
      search: /\bZionward(s?)\b/g,
      replace: `towards Zion`,
      isMaybe: true,
      fixable: false,
    },
    {
      test: `jollity`,
      search: /\b(J|j)ollity\b/g,
      replace: (_, firstLetter) => `${firstLetter === `J` ? `M` : `m`}erriment`,
      fixable: false,
      message: `"<found>" should be replaced in modernized editions (merriment, revelry, mirth, gaiety, merrymaking, cheerfulness, etc.)`,
    },
    {
      test: `intercourse`,
      search: /\b(I|i)ntercourse\b/g,
      recommend: false,
      fixable: false,
      message: `"<found>" should be replaced in modernized editions (communication, interaction, conversation, commerce, dealings, exchange, fellowship, communion, contact, correspondence, etc.)`,
    },
    {
      test: `ejaculat`,
      search: /\b(E|e)jaculat(ed?|ions?|ing)\b/g,
      recommend: false,
      fixable: false,
      message: `"<found>" should be replaced in modernized editions (exclamation, cry, utterance, etc.)`,
    },
  ],
  { langs: [`en`], editions: [`modernized`] },
);

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
  lintOptions: LintOptions,
): LintResult[] => {
  if (lintOptions.lang !== `en` || lintOptions.editionType !== `modernized`) {
    return [];
  }
  return runner.getLineLintResults(line, lineNumber, lines, lintOptions);
};

rule.slug = `modernize-words`;
runner.rule = rule.slug;

export default rule;
