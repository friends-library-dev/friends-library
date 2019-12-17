import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (line === '') {
    return [];
  }

  const regex = /\+{3}\[\+{6}\[\+{3}\w+\]\]/;
  const match = line.match(regex);
  if (!match) {
    return [];
  }

  return [
    {
      line: lineNumber,
      column: match.index ? match.index + 1 : 0,
      type: 'error',
      rule: rule.slug,
      message: 'Libre Office ref artifacts must be removed',
      fixable: true,
      recommendation: line.replace(regex, ''),
    },
  ];
};

rule.slug = 'libre-office-artifacts';
export default rule;
