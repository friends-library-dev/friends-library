import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';
import RegexLintRunner from '../RegexLintRunner';

const ruleSlug = 'obsolete-spellings';

const runner = new RegexLintRunner(
  [
    {
      test: 'staid',
      search: /\b(S|s)taid\b/g,
      replace: '$1tayed',
    },
    {
      replace: 'Melchizedek',
      search: /\bMelchi(sedec|zedeck|sedek)\b/g,
      test: 'Melchi',
    },
    {
      test: 'connexion',
      search: /\b(C|c)onnexion(s)?/g,
      replace: '$1onnection$2',
    },
    {
      test: 'behove',
      search: /\b(B|b)ehove(s)?/g,
      replace: '$1ehoove$2',
    },
    {
      test: 'vail',
      search: /\bvail(s|ed)?/g,
      replace: 'veil$1',
    },
    {
      test: 'gaol',
      search: /\b(G|g)aol(er)?/g,
      replace: (_, g, end) => `${g === 'G' ? 'J' : 'j'}ail${end || ''}`,
    },
    {
      test: 'burthen',
      search: /\b(B|b)urthen(s|some|ed)?/g,
      replace: '$1urden$2',
    },
    {
      test: 'stopt',
      search: /\b(S|s)topt\b/g,
      replace: '$1topped',
    },
    {
      test: 'Corah',
      search: /\bCorah\b/g,
      replace: 'Korah',
    },
    {
      test: 'Barbadoes',
      search: /\bBarbadoes\b/g,
      replace: 'Barbados',
    },
    {
      test: 'ilful',
      search: /\b(un)?(sk|w)ilful(ly|ness)\b/gi,
      replace: '$1$2illful$3',
    },
    {
      test: 'subtil',
      search: /\b(S|s)ubtil(ty|ly)?\b/g,
      replace: (_, s, end) => {
        if (!end) return `${s}ubtle`;
        if (end === 'ty') return `${s}ubtlety`;
        return `${s}ubtly`;
      },
    },
    {
      test: 'fulfil',
      search: /\b(F|f)ulfil\b/g,
      replace: '$1ulfill',
    },
    {
      test: 'hardheartedness',
      search: /\b(H|h)ardheartedness\b/g,
      replace: '$1ard-heartedness',
    },
    {
      test: 'fellow-',
      search: /\b(F|f)ellow-(creature|servant|traveller)(s)?\b/g,
      replace: '$1ellow $2$3',
    },
    {
      test: 'heavy-laden',
      search: /\b(H|h)eavy-laden\b/g,
      replace: '$1eavy laden',
    },
    {
      test: '-hearted',
      search: /\b((F|f)aint|(B|b)roken|(L|l)ight)-hearted\b/g,
      replace: '$1hearted',
    },
    {
      test: 'judgment-seat',
      search: /\b(J|j)udgment-seat\b/g,
      replace: '$1udgment seat',
    },
    {
      test: 'sion',
      search: /\bSion(-?wards?)?\b/g,
      replace: (_, end) => `Zion${end ? end.replace(/^-/, '') : ''}`,
    },
    {
      test: 'Zion-ward',
      search: /\bZion-ward(s)?\b/g,
      replace: 'Zionward$1',
    },
    {
      test: 'holy-days',
      search: /\b(H|h)oly-days\b/g,
      replace: '$1oly days',
    },
    {
      test: 'worship-house',
      search: /\b(W|w)orship-house(s)?\b/g,
      replace: '$1orship house$2',
    },
    {
      test: 'inn-keeper',
      search: /\b(I|i)nn-keeper(s)?\b/g,
      replace: '$1nnkeeper$2',
    },
    {
      test: 'dining-room',
      search: /\b(D|d)ining-room(s)?\b/g,
      replace: '$1ining room$2',
    },
    {
      test: 're-establish',
      search: /\b(R|r)e-establish(ed|ment|ing)?\b/g,
      replace: '$1eestablish$2',
    },
    {
      test: '-minded',
      search: /\b((S|s)piritually|(R|r)eligiously)-minded\b/g,
      replace: '$1 minded',
    },
    {
      test: '\\bwo\\b',
      search: /\b(W|w)o\b/g,
      replace: '$1oe',
    },
    {
      test: 'hope-well',
      search: /\bHope-well\b/g,
      replace: 'Hopewell',
    },
    {
      test: 'bishoprick',
      search: /\b(B|b)ishoprick\b/g,
      replace: '$1ishopric',
    },
    {
      test: 'loving-kindness',
      search: /\b(L|l)oving-kindness\b/g,
      replace: '$1ovingkindness',
    },
  ],
  ruleSlug,
);

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  return runner.getLineLintResults(line, lineNumber);
};

rule.slug = ruleSlug;
export default rule;
