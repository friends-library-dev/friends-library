import { Asciidoc, LintResult } from '@friends-library/types';
import { BlockRule } from '../types';

const rule: BlockRule = (block: Asciidoc): LintResult[] => {
  const lines = block.split('\n');
  const chapterHeadings: number[] = lines.reduce((acc, line, index) => {
    if (line && line.substring(0, 3) === '== ' && line.match(/^== +[^\s\n]/)) {
      acc.push(index + 1);
    }
    return acc;
  }, [] as number[]);

  if (chapterHeadings.length === 1) {
    return [];
  }

  if (chapterHeadings.length === 0) {
    return [
      {
        line: 1,
        column: false,
        type: 'error',
        rule: rule.slug,
        message: 'Every file must have exactly one chapter level heading `== `',
        fixable: false,
      },
    ];
  }

  return chapterHeadings.slice(1).map(line => ({
    line,
    column: false,
    type: 'error',
    rule: rule.slug,
    message: `Duplicate chapter heading \`== \` -- see line ${chapterHeadings[0]}`,
    fixable: false,
  }));
};

rule.slug = 'chapter-heading';
export default rule;
