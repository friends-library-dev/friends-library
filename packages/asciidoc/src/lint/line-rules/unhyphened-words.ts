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
    /\b(to-day|to-morrow|sun-sets?|bed-sides?|day-times?|death-beds?|road-sides?|slave-holders?|pre-eminen(ce|t|tly)|re-enter(s|ed)?|re-establish(ing|ed|ment|es)?|re-examin(ing|ed|e|ation|es)|re-embark(s|ed|ing|ation)?|co-operat(e|ing|ed|ion|es))\b/i,
  );

  if (!match || match.index === undefined) {
    return [];
  }

  return [
    {
      line: lineNumber,
      column: match.index + 1 + match[1].indexOf('-'),
      rule: rule.slug,
      type: 'error',
      message:
        'Archaic hyphenations (like to-day and to-morrow) should be replaced with modern spelling.',
      recommendation: line
        .replace(/(T|t)o-day/g, '$1oday')
        .replace(/(T|t)o-morrow/g, '$1omorrow')
        .replace(/(S|s)un-set(s)?/g, '$1unset$2')
        .replace(/(R|r)oad-side(s)?/g, '$1oadside$2')
        .replace(/(D|d)ay-time(s)?/g, '$1aytime$2')
        .replace(/(D|d)eath-bed(s)?/g, '$1eathbed$2')
        .replace(/(R|r)e-enter(s|ed)?/g, '$1eenter$2')
        .replace(/(R|r)e-establish(ing|ed|ment)?/g, '$1eestablish$2')
        .replace(/(R|r)e-examin(ing|ed|e|ation)/g, '$1eexamin$2')
        .replace(/(R|r)e-embark(s|ed|ing|ation)?/g, '$1eembark$2')
        .replace(/(P|p)re-eminen(ce|t|tly)/g, '$1reeminen$2')
        .replace(/(S|s)lave-holder(s)?/g, '$1laveholder$2')
        .replace(/(C|c)o-operat(e|ing|ed|ion|es)/g, '$1ooperat$2')
        .replace(/(B|b)ed-side(s)?/g, '$1edside$2'),
      fixable: true,
    },
  ];
}

rule.slug = 'unhyphened-words';
