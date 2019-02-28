// @flow
import type { Asciidoc, LintResult } from '../../../../type';
import { values } from '../../../../flow-utils';
import * as lineLints from './line-rules';
import * as blockLints from './block-rules';

export default function lint(adoc: Asciidoc): Array<LintResult> {
  const lineRules = values(lineLints);
  const lines = adoc.split('\n');
  const lineResults = lines.reduce((acc, line, index) => {
    lineRules.forEach(rule => {
      const ruleResults = rule(line, lines, index + 1);
      ruleResults.forEach(result => acc.push(result));
    });
    return acc;
  }, []);

  const blockRules = values(blockLints);
  const blockResults = blockRules.reduce((acc, rule) => {
    return acc.concat(...rule(adoc));
  }, []);

  return [...lineResults, ...blockResults];
}
