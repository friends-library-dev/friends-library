import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (line !== '') {
    return [];
  }

  const prevLine = lines[lineNumber - 2];
  if (typeof prevLine === 'undefined' || prevLine !== '') {
    return [];
  }

  // we only flag the LAST line of a multi-line violation
  const nextLine = lines[lineNumber];
  if (nextLine === '') {
    return [];
  }

  const remove = [];
  let offset = 2;
  let current = lines[lineNumber - offset];
  while (current === '') {
    offset++;
    remove.push(lineNumber - offset + 2);
    current = lines[lineNumber - offset];
  }

  return [
    {
      line: lineNumber,
      column: false,
      type: 'error',
      rule: rule.slug,
      message: 'Multiple blank lines are not allowed',
      fixable: true,
      recommendation: `--> remove preceding line/s: (${remove.sort().join(',')})`,
    },
  ];
};

rule.slug = 'multiple-blank-lines';
export default rule;
