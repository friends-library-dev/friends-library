import { Asciidoc, LintResult } from '@friends-library/types';

type Delimiter = {
  line: number;
  type: 'start' | 'end';
  flagged: boolean;
};

export default function rule(block: Asciidoc): LintResult[] {
  const lines = block.split('\n');
  const delimiters = lines.reduce(
    (delims, line, index) => {
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
    },
    [] as Delimiter[],
  );

  let opened = false;
  const lints = delimiters.reduce(
    (acc, current, index) => {
      const prev = delimiters[index - 1];
      if (current.type === 'start' && opened && prev) {
        current.flagged = true;
        acc.push(unterminated(prev.line));
      }

      if (current.type === 'end' && !opened && (!prev || !prev.flagged)) {
        current.flagged = true;
        acc.push(unlabeled(current.line));
      }

      opened = current.type === 'start';
      return acc;
    },
    [] as LintResult[],
  );

  if (opened && delimiters.length > 0) {
    // @ts-ignore https://github.com/Microsoft/TypeScript/issues/30406
    lints.push(unterminated(delimiters.pop().line));
  }

  return lints;
}

function unterminated(line: number): LintResult {
  return {
    line,
    column: false,
    type: 'error',
    rule: rule.slug,
    message: 'This block was never terminated with a `--` line.',
  };
}

function unlabeled(line: number): LintResult {
  return {
    line,
    column: false,
    type: 'error',
    rule: rule.slug,
    message:
      'Open blocks must be started with a class designation, like `[.embedded-content-document.letter]`',
  };
}

rule.slug = 'open-block';
