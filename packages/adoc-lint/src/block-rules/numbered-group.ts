import { Asciidoc, LintResult } from '@friends-library/types';
import { BlockRule } from '../types';

interface Delimiter {
  line: number;
  type: 'start' | 'end';
  flagged: boolean;
}

const rule: BlockRule = (block: Asciidoc): LintResult[] => {
  const lints: LintResult[] = [];
  let withinNumberedGroup = false;
  let lastFlagged = 0;
  const lines = block.split(`\n`);

  lines.forEach((line, index) => {
    const isGroupStart = line === `====` && lines[index - 1] === `[.numbered-group]`;
    if (isGroupStart && withinNumberedGroup) {
      lastFlagged = 0;
    } else if (isGroupStart) {
      lastFlagged = 0;
      withinNumberedGroup = true;
    } else if (line === `====` && withinNumberedGroup) {
      withinNumberedGroup = false;
    } else if (
      line === `[.numbered]` &&
      !withinNumberedGroup &&
      (!lastFlagged || (lastFlagged && index - lastFlagged > 150))
    ) {
      lastFlagged = index;
      lints.push(outOfGroup(index + 1));
    }
  });

  return lints;
};

rule.slug = `numbered-group`;

export default rule;

function outOfGroup(lineNumber: number): LintResult {
  return {
    type: `error`,
    line: lineNumber,
    column: false,
    rule: rule.slug,
    message: `Numbered chunks must be within a [.numbered-group] block`,
  };
}
