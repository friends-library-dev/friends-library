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
  const regex = /\[\.book-title\]#/g;

  let match: RegExpExecArray | null = null;
  while ((match = regex.exec(line))) {
    const restOfLine = line.substring(match.index + 14);
    if (restOfLine.match(/^[^[]+#/)) {
      continue;
    }

    const restOfParagraph = lines
      .slice(lineNumber - 1)
      .join(`•`)
      .substring(match.index + 14)
      .replace(/••.+/, ``)
      .replace(/•/g, ` `);

    let endMatch: RegExpExecArray | null = null;
    const endRegex = /(?:\[.book-title\]|#)/g;
    let foundStart = false;
    let foundEnd = false;

    while ((endMatch = endRegex.exec(restOfParagraph))) {
      if (!foundStart && endMatch[0] === `#`) {
        foundEnd = true;
      } else {
        foundStart = true;
      }
    }

    if (!foundEnd) {
      lints.push({
        line: lineNumber,
        column: match.index + 14,
        type: `error`,
        rule: rule.slug,
        message: `This book title was never closed properly with a "#"`,
      });
    }
  }
  return lints;
};

rule.slug = `book-title-unclosed`;

export default rule;
