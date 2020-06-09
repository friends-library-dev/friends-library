import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (line === `` || !line.includes(`--`)) {
    return [];
  }

  const nextLine = lines[lineNumber] || ``;
  const combined = `${line}${nextLine ? `\n${nextLine}` : ``}`;
  const match = combined.match(/--(\n)?_[^_]/);
  if (!match) {
    return [];
  }

  const isMultiLine = typeof match[1] !== `undefined`;

  return [
    {
      line: lineNumber + (isMultiLine ? 1 : 0),
      column: isMultiLine ? 1 : (match.index || 0) + 3,
      type: `error`,
      rule: rule.slug,
      recommendation: (isMultiLine ? nextLine : line).replace(/_/g, `__`),
      message: `Must use double-underscore italics when preceded by double-dash (emdash)`,
    },
  ];
};

rule.slug = `emdash-touching-italics`;
export default rule;
