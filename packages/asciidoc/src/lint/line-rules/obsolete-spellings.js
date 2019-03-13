// @flow
import memoize from 'lodash/memoize';
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '') {
    return [];
  }

  const words = [
    ['connexion', 'connection', true],
    ['connexions', 'connections', true],
    ['behove', 'behoove', true],
    ['behoves', 'behooves', true],
    ['staid', 'stayed', true],

    // @see https://books.google.com/ngrams for data backing up below choices
    ['hardheartedness', 'hard-heartedness', true],
    ['fellow-creatures', 'fellow creatures', true],
    ['fellow-travellers', 'fellow travellers', true],
    ['fellow-traveller', 'fellow traveller', true],
    ['fellow-servants', 'fellow servants', true],
    ['fellow-servant', 'fellow servant', true],
    ['heavy-laden', 'heavy laden', true],
  ];

  const results = [];
  words.forEach(([obsolete, corrected, fixable, info]) => {
    const find = new RegExp(`\\b${obsolete}\\b`, 'i');
    const match = line.match(find);
    if (match) {
      results.push(getLint(
        line,
        lineNumber,
        match.index + 1,
        obsolete,
        corrected,
        fixable,
        typeof info === 'string' ? info : '',
      ));
    }
  });

  return results;
}

const getSearchReplace = memoize((obsolete: string, corrected: string): [RegExp, string] => {
  const letters = obsolete.split('');
  const first = letters.shift();
  const rest = letters.join('');
  const search = new RegExp(`\\b(${first.toUpperCase()}|${first.toLowerCase()})${rest}\\b`, 'g');
  const replace = corrected.split('').filter((l, i) => i !== 0).join('');
  return [search, replace];
});

rule.slug = 'obsolete-spellings';

function getLint(
  line: Asciidoc,
  lineNumber: number,
  column: number,
  obsolete: string,
  corrected: string,
  fixable: boolean,
  info: string,
): LintResult {
  const [search, replace] = getSearchReplace(obsolete, corrected);
  return {
    line: lineNumber,
    column,
    type: 'error',
    rule: 'obsolete-spellings',
    message: `"${obsolete}" should be replaced with "${corrected}" in all editions`,
    fixable,
    recommendation: line.replace(search, `$1${replace}`),
    ...info !== '' ? { info } : {},
  };
}
