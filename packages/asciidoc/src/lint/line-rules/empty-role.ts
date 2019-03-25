import { Asciidoc, LintResult } from '@friends-library/types';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '' || line[0] !== '[' || line[line.length - 1] !== ']') {
    return [];
  }

  const match = line.match(/^\[[^ \[]+(\.)\]$/);
  if (!match) {
    return [];
  }

  return [
    {
      line: lineNumber,
      column: line.length - 1,
      type: 'error',
      rule: rule.slug,
      message: 'empty classname (periods must be followed by something or omitted)',
      fixable: false,
      recommendation: line.replace(/\.\]$/, ']'),
    },
  ];
}

rule.slug = 'empty-role';
