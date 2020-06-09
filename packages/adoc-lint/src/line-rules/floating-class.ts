import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (line === `` || lines[lineNumber] !== ``) {
    return [];
  }

  if (line[0] !== `[` || line[line.length - 1] !== `]`) {
    return [];
  }

  if (line.indexOf(`]`) !== line.length - 1) {
    return [];
  }

  return [
    {
      line: lineNumber,
      column: false,
      type: `error`,
      rule: rule.slug,
      message: `Class/id designations (like \`[.something]\`) may not be followed by an empty line`,
    },
  ];
};

rule.slug = `floating-class`;
export default rule;
