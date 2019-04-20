import { Asciidoc, LintResult } from '@friends-library/types';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (line.length < 5 || line.indexOf('-') === -1) {
    return [];
  }

  const match = line.match(
    /\b(to-day|to-morrow|sun-set|bed-side|day-time|death-bed|road-side|slave-holders?)\b/i,
  );
  if (!match || match.index === undefined) {
    return [];
  }
  return [
    {
      line: lineNumber,
      column: match.index + 1,
      rule: rule.slug,
      type: 'error',
      message:
        'Archaic hyphenations (like to-day and to-morrow) should be replaced with modern spelling.',
      recommendation: line
        .replace(/(T|t)o-day/g, '$1oday')
        .replace(/(T|t)o-morrow/g, '$1omorrow')
        .replace(/(S|s)un-set/g, '$1unset')
        .replace(/(R|r)oad-side/g, '$1oadside')
        .replace(/(D|d)ay-time/g, '$1aytime')
        .replace(/(D|d)eath-bed/g, '$1eathbed')
        .replace(/(S|s)lave-holder(s)?/g, '$1laveholder$2')
        .replace(/(B|b)ed-side/g, '$1edside'),
      fixable: true,
    },
  ];
}

rule.slug = 'unhyphened-words';
