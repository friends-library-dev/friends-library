// @flow
import type { Asciidoc, LintResult } from '../../../../type';

export default function fix(
  adoc: Asciidoc,
  lints: Array<LintResult>,
): [Asciidoc, number] {
  let numUnfixedFixables = 0;
  const modifiedLines = new Set();
  const lines = ((adoc.split('\n'): any): Array<string | null>);

  lints.forEach(lint => {
    if (!lint.fixable || typeof lint.recommendation !== 'string') {
      return;
    }

    const { recommendation } = lint;
    if (modifiedLines.has(lint.line)) {
      numUnfixedFixables++;
      return;
    }

    if (lint.rule === 'unspaced-class') {
      lines[lint.line - 1] = `\n${lines[lint.line - 1] || ''}`;
      modifiedLines.add(lint.line);
      return;
    }

    if (lint.rule === 'multiple-blank-lines') {
      const remove = recommendation
        .replace(/[^\d,]/g, '')
        .split(',')
        .map(Number);

      remove.forEach(lineNumber => {
        if (!modifiedLines.has(lineNumber)) {
          lines[lineNumber - 1] = null;
          modifiedLines.add(lineNumber);
        }
      });
      return;
    }

    // $FlowFixMe
    if (lint.rule === 'trailing-hyphen' || (lint.rule === 'join-words' && lint.recommendation.indexOf('\n') !== -1)) {
      if (modifiedLines.has(lint.line + 1)) {
        numUnfixedFixables++;
      } else {
        const [first, second] = recommendation.split('\n');
        lines[lint.line - 1] = first;
        lines[lint.line] = second;
        modifiedLines.add(lint.line);
        modifiedLines.add(lint.line + 1);
      }
      return;
    }

    if (lint.rule === 'eof-newline') {
      lines.push('');
      return;
    }

    lines[lint.line - 1] = recommendation;
    modifiedLines.add(lint.line);
  });

  return [
    lines.filter(l => l !== null).join('\n'),
    numUnfixedFixables,
  ];
}
