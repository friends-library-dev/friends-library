import { Asciidoc, LintResult } from '@friends-library/types';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (line === '' || !line.includes('undefined')) {
    return [];
  }

  const column = line.indexOf('undefined') + 1;

  return [
    {
      line: lineNumber,
      column,
      type: 'error',
      rule: rule.slug,
      message: '`undefined` is usually a scripting error artifact and should be removed',
      fixable: false,
    },
  ];
}

rule.slug = 'no-undefined';
