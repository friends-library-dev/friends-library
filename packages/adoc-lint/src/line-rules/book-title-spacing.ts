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
  const regex = /\[\.book-title\]( +#|# +|#$)/g;

  let match: RegExpMatchArray | null = null;
  while ((match = regex.exec(line))) {
    lints.push({
      line: lineNumber,
      column: (match.index || 0) + 15,
      type: `error`,
      rule: rule.slug,
      message: `Improper spacing around [.book-title]`,
      fixable: match[1] !== `#`,
      recommendation:
        match[1] !== `#` ? line.replace(match[0], `[.book-title]#`) : undefined,
    });
  }

  return lints;
};

rule.slug = `book-title-spacing`;

export default rule;
