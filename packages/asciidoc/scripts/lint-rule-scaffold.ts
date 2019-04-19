import { Asciidoc, LintResult } from '@friends-library/types';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (line === '') {
    return [];
  }

  return [
    {
      line: lineNumber,
      column: 1,
      type: 'error',
      rule: rule.slug,
      message: 'your message here',
    },
  ];
}

rule.slug = 'my-slug';
