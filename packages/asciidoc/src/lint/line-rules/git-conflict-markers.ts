import { Asciidoc, LintResult } from '@friends-library/types';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (line === '') {
    return [];
  }

  if (line[0] !== '=' && line[0] !== '>' && line[0] !== '<') {
    return [];
  }

  if (!line.match(/^(=======|<<<<<<<|>>>>>>>)/)) {
    return [];
  }

  return [
    {
      line: lineNumber,
      column: false,
      type: 'error',
      rule: rule.slug,
      message: 'Git conflict markers must be removed.',
    },
  ];
}

rule.slug = 'git-conflict-markers';
