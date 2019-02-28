// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function(block: Asciidoc): Array<LintResult> {
  const lines = block.split('\n');
  const delimiter = lines.reduce((delims, line, index) => {
    if (line !== '--') {
      return delims;
    }
    const isStart = lines[index - 1].indexOf('[.') === 0;
    delims.push({
      line: index + 1,
      type: isStart ? 'start' : 'end',
      flagged: false,
    });
    return delims;
  }, []);

  let opened = false;
  const lints = delimiter.reduce((acc, current, index) => {
    const prev = delimiter[index - 1];
    if (current.type === 'start' && opened && prev) {
      current.flagged = true;
      acc.push(unterminated(prev.line))
    }

    if (current.type === 'end' && !opened && (!prev || !prev.flagged)) {
      current.flagged = true;
      acc.push(unlabeled(current.line))
    }

    opened = current.type === 'start';
    return acc;
  }, []);

  if (opened) {
    lints.push(unterminated(delimiter.pop().line));
  }

  return lints;
}

function unterminated(line: number): LintResult {
  return {
    line,
    column: false,
    type: 'error',
    rule: 'unterminated-open-block',
    message: 'This block was never terminated with a `--` line.',
  };
}

function unlabeled(line: number): LintResult {
  return {
    line,
    column: false,
    type: 'error',
    rule: 'unlabeled-open-block-delimiter',
    message: 'Open blocks must be started with a class designation, like `[.embedded-content-document.letter]`',
  };
}
