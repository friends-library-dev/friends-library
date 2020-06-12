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
    if (line === `--` && lines[index - 1] === `[.numbered-group]`) {
      lastFlagged = 0;
      withinNumberedGroup = true;
    } else if (line === `--` && withinNumberedGroup) {
      withinNumberedGroup = false;
    } else if (
      line === `[.numbered]` &&
      !withinNumberedGroup &&
      (!lastFlagged || (lastFlagged && index - lastFlagged > 100))
    ) {
      lastFlagged = index;
      lints.push({
        type: `error`,
        line: index + 1,
        column: false,
        rule: rule.slug,
        message: `Numbered chunks must be within a [.numbered-group] block`,
      });
    }
  });
  return lints;
};

rule.slug = `numbered-group`;

export default rule;
