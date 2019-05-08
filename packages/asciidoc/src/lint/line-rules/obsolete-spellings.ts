import memoize from 'lodash/memoize';
import escape from 'escape-string-regexp';
import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { ucfirst } from '../../job/helpers';
import { LineRule } from '../types';

const words: [string, string, boolean][] = [
  ['connexion', 'connection', true],
  ['connexions', 'connections', true],
  ['behove', 'behoove', true],
  ['behoves', 'behooves', true],
  ['staid', 'stayed', true],
  ['Melchisedec', 'Melchizedek', true],
  ['Melchizedeck', 'Melchizedek', true],
  ['Melchisedek', 'Melchizedek', true],
  ['vail', 'veil', false],
  ['vails', 'veils', false],
  ['vailed', 'veiled', false],
  ['gaol', 'jail', true],
  ['gaoler', 'jailer', true],
  ['burthen', 'burden', true],
  ['burthens', 'burdens', true],
  ['burthensome', 'burdensome', true],
  ['burthened', 'burdened', true],
  ['stopt', 'stopped', true],
  ['Corah', 'Korah', false],
  ['Barbadoes', 'Barbados', false],
  ['skilful', 'skillful', true],
  ['unskilful', 'unskillful', true],
  ['skilfully', 'skillfully', true],
  ['unskilfully', 'unskillfully', true],
  ['wilful', 'willful', true],
  ['wilfully', 'willfully', true],
  ['wilfulness', 'willfulness', true],
  ['subtil', 'subtle', true],
  ['subtilty', 'subtlety', true],
  ['subtilly', 'subtly', true],
  ['fulfil', 'fulfill', true],

  // @see https://books.google.com/ngrams for data backing up below choices
  ['hardheartedness', 'hard-heartedness', true],
  ['fellow-creatures', 'fellow creatures', true],
  ['fellow-travellers', 'fellow travellers', true],
  ['fellow-traveller', 'fellow traveller', true],
  ['fellow-servants', 'fellow servants', true],
  ['fellow-servant', 'fellow servant', true],
  ['heavy-laden', 'heavy laden', true],
  ['faint-hearted', 'fainthearted', true],
  ['broken-hearted', 'brokenhearted', true],
  ['light-hearted', 'lighthearted', true],
  ['judgment-seat', 'judgment seat', true],
  ['holy-days', 'holy days', true],
  ['worship-house', 'worship house', true],
  ['worship-houses', 'worship houses', true],
  ['dining-room', 'dining room', true],
  ['inn-keeper', 'innkeeper', true],
  ['inn-keepers', 'innkeepers', true],
  ["inn-keeper`'s", "innkeeper`'s", true],
  ['re-establish', 'reestablish', true],
  ['re-established', 'reestablished', true],
  ['re-establishment', 'reestablishment', true],
  ['re-establishing', 'reestablishing', true],
  ['spiritually-minded', 'spiritually minded', true],
  ['religiously-minded', 'religiously minded', true],
  ['wo', 'woe', true],
];

const test = new RegExp(
  `\\b${words.map(([obsolete]) => escape(obsolete)).join('|')}\\b`,
  'i',
);

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
  { lang }: LintOptions,
): LintResult[] => {
  if (lang === 'es' || line === '') {
    return [];
  }

  if (!line.match(test)) {
    return [];
  }

  const results: LintResult[] = [];
  words.forEach(([obsolete, corrected, caseInsensitive]) => {
    const find = new RegExp(`\\b${obsolete}\\b`, caseInsensitive ? 'i' : '');
    const match = line.match(find);
    if (match && match.index !== undefined) {
      const column = match.index + 1 + getColumnOffset(obsolete, corrected);
      results.push(getLint(line, lineNumber, column, obsolete, corrected));
    }
  });

  return results;
};

const getSearch = memoize(
  (obsolete: string): RegExp => {
    const letters = obsolete.split('');
    const first = letters.shift() || '';
    const rest = letters.join('');
    return new RegExp(
      `\\b(${first.toUpperCase()}|${first.toLowerCase()})${rest}\\b`,
      'g',
    );
  },
);

function getColumnOffset(obsolete: string, corrected: string): number {
  for (let i = 0; i < obsolete.length; i++) {
    if (corrected[i] !== obsolete[i]) {
      return i;
    }
  }
  return obsolete.length;
}

rule.slug = 'obsolete-spellings';
export default rule;

function getLint(
  line: Asciidoc,
  lineNumber: number,
  column: number,
  obsolete: string,
  corrected: string,
): LintResult {
  const search = getSearch(obsolete);
  return {
    line: lineNumber,
    column,
    type: 'error',
    rule: rule.slug,
    message: `"${obsolete}" should be replaced with "${corrected}" in all editions`,
    fixable: true,
    recommendation: line.replace(search, match => {
      if (match[0].match(/[A-Z]/)) {
        return ucfirst(corrected);
      }
      return corrected;
    }),
  };
}
