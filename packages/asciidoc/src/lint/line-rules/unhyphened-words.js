// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line.length < 5 || line.indexOf('-') === -1) {
    return [];
  }

  const match = line.match(/\b(to-day|to-morrow|sun-set|bed-side)\b/i);
  if (!match) {
    return [];
  }
  return [{
    line: lineNumber,
    column: match.index + 3,
    rule: rule.slug,
    type: 'error',
    message: 'Archaic hyphenations (like to-day and to-morrow) should be replaced with modern spelling.',
    recommendation: line
      .replace(/(T|t)o-day/g, '$1oday')
      .replace(/(T|t)o-morrow/g, '$1omorrow')
      .replace(/(S|s)un-set/g, '$1unset')
      .replace(/(B|b)ed-side/g, '$1edside'),
    fixable: true,
  }];
}

rule.slug = 'unhyphened-words';
