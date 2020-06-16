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
  let lastGroupStart = -1;
  let lastFlagged = 0;
  const lines = block.split(`\n`);

  lines.forEach((line, index) => {
    const isGroupStart = line === `====` && lines[index - 1] === `[.numbered-group]`;

    if (line === `====` && !isGroupStart && !withinNumberedGroup) {
      lints.push({
        type: `error`,
        line: index + 1,
        column: false,
        rule: rule.slug,
        message: `Unexpected [.numbered-group] terminating delimiter`,
      });
    }

    if (isGroupStart && withinNumberedGroup) {
      lints.push(unterminated(lastGroupStart));
      lastFlagged = 0;
      lastGroupStart = index + 1;
    } else if (isGroupStart) {
      lastFlagged = 0;
      lastGroupStart = index + 1;
      withinNumberedGroup = true;
    } else if (line === `====` && withinNumberedGroup) {
      withinNumberedGroup = false;
    } else if (
      line === `[.numbered]` &&
      !withinNumberedGroup &&
      (!lastFlagged || (lastFlagged && index - lastFlagged > 100))
    ) {
      lastFlagged = index;
      lints.push(outOfGroup(index + 1));
    }

    if (line === `====` && !isGroupStart) {
      const missingEmptyLineLocations: string[] = [];
      if (lines[index - 1] !== ``) {
        missingEmptyLineLocations.push(`before`);
      }
      if (lines[index + 1] !== ``) {
        missingEmptyLineLocations.push(`after`);
      }
      if (missingEmptyLineLocations.length) {
        lints.push({
          type: `error`,
          line: index + 1,
          column: false,
          rule: rule.slug,
          message: `Numbered-group delimiters must be surrounded by blank lines`,
          recommendation: `--> insert blank line ${missingEmptyLineLocations.join(
            ` and `,
          )} line ${index + 1}`,
          fixable: true,
        });
      }
    }
  });

  if (withinNumberedGroup) {
    lints.push(unterminated(lastGroupStart));
  }

  return lints;
};

rule.slug = `numbered-group`;

export default rule;

function unterminated(lineNumber: number): LintResult {
  return {
    type: `error`,
    line: lineNumber,
    column: false,
    rule: rule.slug,
    message: `This block was never terminated with a \`====\` line.`,
  };
}

function outOfGroup(lineNumber: number): LintResult {
  return {
    type: `error`,
    line: lineNumber,
    column: false,
    rule: rule.slug,
    message: `Numbered chunks must be within a [.numbered-group] block`,
  };
}
