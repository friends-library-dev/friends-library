import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule } from '../types';
import RegexLintRunner from '../RegexLintRunner';

const runner = new RegexLintRunner(
  [
    {
      test: `proffer`,
      search: /\b(P|p)roffer/g,
      replace: (_, p) => `${p === `P` ? `O` : `o`}ffer`,
      message: `"proffer" should be replaced in modernized editions (offer, tender, propose)`,
      fixable: false,
    },
    {
      test: `builded`,
      search: /\b(B|b)uilded\b/g,
      replace: `$1uilt`,
    },
    {
      test: `min`,
      search: /\b(M|m)ine (a|e|i|o|u)/g,
      fixable: (match, line) => {
        const check = line.substr(match.index || 0).toLowerCase();
        return !!check.match(
          /^mine (eyes?|ears?|afflictions?|enem(y|ies)|own|anointed|acquaintances?|anger|elect|iniquit(y|ies)|inheritance|adversar(y|ies)|offen(s|c)es?|altars?|accusers?|infirmit(y|ies)|exercises?|unfitness)\b/,
        );
      },
      replace: `$1y $2`,
      allowIfNear: /\bmine (and|in|is|of|at|as|or|unites|on|are|ascend|also|often|inherit|unto|appeared|into|under)\b/i,
      message: `"mine" used as the modern "my" (e.g. "mine eyes have seen") should be updated to "my"`,
    },
    {
      test: `you`,
      search: /\b(Believe|Go|Seek|Get|Come) (Y|y)ou\b/g,
      replace: `$1`,
      fixable: false,
      message: `"<verb> you" is often an automated modernization error and should be replaced with "<verb>"`,
      includeNextLineFirstWord: true,
      allowIfNear: /(go|come) you (cursed|blessed|workers)/i,
    },
    {
      test: `holden`,
      search: /\b(H|h)olden\b/g,
      replace: `$1eld`,
      allowIfNear: /Cave/,
      fixable: false,
    },
    {
      test: `you`,
      search: /\b(Y|y)ou wilt\b/g,
      replace: `$1ou will`,
      fixable: (_, line) => !!line.match(/\byou wilt\b/i),
      message: `"you wilt" is an automated modernization error and should be replaced with "you will"`,
      includeNextLineFirstWord: true,
    },
    {
      test: `issue`,
      search: /\b(I|i)ssue\b/g,
      fixable: false,
      isMaybe: true,
      message: `"issue" should sometimes be replaced in modernized editions (result, outcome, consequence, offspring)`,
    },
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
