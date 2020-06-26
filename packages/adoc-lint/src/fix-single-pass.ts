import { Asciidoc, LintResult } from '@friends-library/types';

export default function fix(adoc: Asciidoc, lints: LintResult[]): [Asciidoc, number] {
  let numUnfixedFixables = 0;
  const modifiedLines = new Set();
  const lines = adoc.split(`\n`) as (string | null)[];

  lints.forEach(lint => {
    const lineIndex = lint.line - 1;
    const line = lines[lineIndex];
    if (!lint.fixable || typeof lint.recommendation !== `string`) {
      return;
    }

    const { recommendation, rule } = lint;
    if (modifiedLines.has(lint.line)) {
      numUnfixedFixables++;
      return;
    }

    if (rule === `unspaced-markup`) {
      lines[lineIndex] = `${line}\n`;
      modifiedLines.add(lint.line);
      return;
    }

    if (rule === `open-block` || rule === `wrapping-block`) {
      lines[lineIndex] = `\n${line}`;
      modifiedLines.add(lint.line);
      return;
    }

    if (rule === `unspaced-class`) {
      lines[lineIndex] = `\n${line || ``}`;
      modifiedLines.add(lint.line);
      return;
    }

    if (rule === `multiple-blank-lines`) {
      const remove: number[] = recommendation
        .replace(/[^\d,]/g, ``)
        .split(`,`)
        .map(Number);

      remove.forEach(lineNumber => {
        if (!modifiedLines.has(lineNumber)) {
          lines[lineNumber - 1] = null;
          modifiedLines.add(lineNumber);
        }
      });
      return;
    }

    if (rule === `footnote-split-spacing`) {
      if (!modifiedLines.has(lint.line)) {
        lines[lineIndex] = null;
        modifiedLines.add(lint.line);
      }
      return;
    }

    if (rule === `numbered-group`) {
      if (!modifiedLines.has(lint.line)) {
        const before = recommendation.includes(`before`);
        const after = recommendation.includes(`after`);
        lines[lineIndex] = `${before ? `\n` : ``}${line}${after ? `\n` : ``}`;
        modifiedLines.add(lint.line);
      }
      return;
    }

    if (
      rule === `trailing-hyphen` ||
      rule === `dangling-possessive` ||
      (rule === `join-words` && recommendation.includes(`\n`))
    ) {
      if (modifiedLines.has(lint.line + 1)) {
        numUnfixedFixables++;
      } else {
        const [first, second] = recommendation.split(`\n`);
        lines[lint.line - 1] = first;
        lines[lint.line] = second;
        modifiedLines.add(lint.line);
        modifiedLines.add(lint.line + 1);
      }
      return;
    }

    if (rule === `eof-newline`) {
      lines.push(``);
      return;
    }

    lines[lint.line - 1] = recommendation;
    modifiedLines.add(lint.line);
  });

  return [lines.filter(l => l !== null).join(`\n`), numUnfixedFixables];
}
