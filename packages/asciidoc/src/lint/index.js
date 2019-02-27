// @flow
import type { Asciidoc, LintResult } from '../../../../type';
import { values } from '../../../../flow-utils';
import * as rules from './rules';

export default function lint(adoc: Asciidoc): Array<LintResult> {
  const lines = adoc.split('\n');
  return lines.reduce((acc, line, index) => {
    values(rules).forEach(rule => {
      const ruleResults = rule(line, lines, index + 1);
      ruleResults.forEach(result => acc.push(result));
    });
    return acc;
  }, []);
}
