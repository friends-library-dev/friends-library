import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (line === `` || !line.includes(`[.book-title]`)) {
    return [];
  }

  const lints: LintResult[] = [];
  const regex = /[^^ ([-]\[\.book-title]/g;

  let match: RegExpExecArray | null = null;
  while ((match = regex.exec(line))) {
    lints.push({
      line: lineNumber,
      column: (match.index || 0) + 1,
      type: `error`,
      rule: rule.slug,
      message: `Only -, (, and [ chars are allowed to touch the beginning of a [.book-title]`,
    });
  }

  return lints;
};

rule.slug = `book-title-start`;

export default rule;
