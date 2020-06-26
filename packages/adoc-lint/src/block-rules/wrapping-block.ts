import { Asciidoc, LintResult } from '@friends-library/types';
import { BlockRule } from '../types';

interface Delimiter {
  line: number;
  type: 'start' | 'end';
  flagged: boolean;
}

const rule: BlockRule = (block: Asciidoc): LintResult[] => {
  const lines = block.split(`\n`);
  const delimiters = lines.reduce((delims, line, index) => {
    if (line !== `====`) {
      return delims;
    }
    const isStart = lines[index - 1].indexOf(`[.`) === 0;
    delims.push({
      line: index + 1,
      type: isStart ? `start` : `end`,
      flagged: false,
    });
    return delims;
  }, [] as Delimiter[]);

  let opened = false;
  const lints = delimiters.reduce((acc, current, index) => {
    const prev = delimiters[index - 1];
    if (current.type === `start`) {
      if (opened && prev) {
        current.flagged = true;
        acc.push(unterminated(prev.line));
      } else if (lines[current.line] && lines[current.line] !== ``) {
        acc.push(missingSurroundingSpace(current.line + 1));
      }
    }

    if (current.type === `end`) {
      if (!opened && (!prev || !prev.flagged)) {
        current.flagged = true;
        acc.push(unlabeled(current.line));
      }

      if (lines[current.line - 2] !== ``) {
        acc.push(missingSurroundingSpace(current.line));
      }

      if (lines[current.line] && lines[current.line] !== ``) {
        acc.push(missingSurroundingSpace(current.line + 1));
      }
    }

    opened = current.type === `start`;
    return acc;
  }, [] as LintResult[]);

  if (opened && delimiters.length > 0) {
    // @ts-ignore https://github.com/Microsoft/TypeScript/issues/30406
    lints.push(unterminated(delimiters.pop().line));
  }

  return lints;
};

function unterminated(line: number): LintResult {
  return {
    line,
    column: false,
    type: `error`,
    rule: rule.slug,
    message: `This block was never terminated with a \`====\` line.`,
  };
}

function unlabeled(line: number): LintResult {
  return {
    line,
    column: false,
    type: `error`,
    rule: rule.slug,
    message: `Wrapping blocks must be started with a class designation, like \`[.numbered-group]\``,
  };
}

function missingSurroundingSpace(line: number): LintResult {
  return {
    line,
    column: false,
    type: `error`,
    fixable: true,
    rule: rule.slug,
    message: `Wrapping block delimiters must be surrounded by empty lines`,
    recommendation: `--> add an empty line before line ${line}`,
  };
}

rule.slug = `wrapping-block`;

export default rule;
