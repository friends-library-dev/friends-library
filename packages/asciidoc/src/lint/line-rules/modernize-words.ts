import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule } from '../types';
import RegexLintRunner from '../RegexLintRunner';

const runner = new RegexLintRunner(
  [
    {
      test: 'amongst',
      search: /\b(A|a)mongst\b/g,
      replace: '$1mong',
      fixable: true,
    },
    {
      test: 'zionward',
      search: /\bZionward(s?)\b/g,
      replace: 'towards Zion',
      isMaybe: true,
      fixable: false,
    },
    {
      test: 'intercourse',
      search: /\b(I|i)ntercourse\b/g,
      recommend: false,
      fixable: false,
      messagePattern:
        '"<found>" should be replaced in modernized editions (communication, interaction, commerce, dealings, exchange, fellowship, communion, contact, correspondence, etc.)',
    },
    {
      test: 'ejaculat',
      search: /\b(E|e)jaculat(ed?|ions?|ing)\b/g,
      recommend: false,
      fixable: false,
      messagePattern:
        '"<found>" should be replaced in modernized editions (exclamation, utterance, etc.)',
    },
  ],
  { langs: ['en'], editions: ['modernized'] },
);

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
  lintOptions: LintOptions,
): LintResult[] => {
  if (lintOptions.lang !== 'en' || lintOptions.editionType !== 'modernized') {
    return [];
  }
  return runner.getLineLintResults(line, lineNumber, lintOptions);
};

rule.slug = 'modernize-words';
runner.rule = rule.slug;

export default rule;
