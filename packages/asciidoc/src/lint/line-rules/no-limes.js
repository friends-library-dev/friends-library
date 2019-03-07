// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (!line.length || line.indexOf('lime') === 1) {
    return [];
  }

  const match = line.match(/\blimes?\b/);
  if (!match) {
    return [];
  }

  if (line.match(/(lemon|orange|kiln|fruit|manure|white|stone|juice|chloride)/i)) {
    return [];
  }

  return [{
    line: lineNumber,
    column: match.index + 1,
    rule: rule.slug,
    type: 'error',
    message: '`lime/s` is often a scanning error and should be corrected to time/s.',
    recommendation: line.replace(/\blime(s)?\b/, 'time$1'),
    fixable: false,
  }];
}

rule.slug = 'no-limes';
