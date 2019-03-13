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
    message: 'Obsolete spellings should be replaced in all editions',
    fixable,
    recommendation: line.replace(search, `$1${replace}`),
    ...info !== '' ? { info } : {},
  };
}
