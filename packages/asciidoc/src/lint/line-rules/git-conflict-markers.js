// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '') {
    return [];
  }

  if (line[0] !== '=' && line[0] !== '>' && line[0] !== '<') {
    return [];
  }

  if (!line.match(/^(=======|<<<<<<<|>>>>>>>)/)) {
    return [];
  }

  return [{
    line: lineNumber,
    column: false,
    type: 'error',
    rule: rule.slug,
    message: 'Git conflict markers must be removed.',
  }];
}

rule.slug = 'git-conflict-markers';
