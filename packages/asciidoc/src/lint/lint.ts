import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import * as lineLints from './line-rules';
import * as blockLints from './block-rules';

export default function lint(
  adoc: Asciidoc,
  options: LintOptions = { lang: 'en' },
): LintResult[] {
  const lineRules = Object.values(lineLints);
  const lines = adoc.split('\n');
  const lineResults = lines.reduce(
    (acc, line, index) => {
      if (isLintComment(line)) {
        return acc;
      }

      if (isComment(line)) {
        acc.push(commentWarning(index + 1));
        return acc;
      }

      lineRules.forEach(rule => {
        if (runRule(rule.slug, options)) {
          const ruleResults = rule(line, lines, index + 1);
          ruleResults.forEach(result => acc.push(result));
        }
      });
      return acc;
    },
    [] as LintResult[],
  );

  const blockRules = Object.values(blockLints);
  const blockResults = blockRules.reduce(
    (acc, rule) => {
      if (!runRule(rule.slug, options)) {
        return acc;
      }
      return acc.concat(...rule(adoc));
    },
    [] as LintResult[],
  );

  return [...lineResults, ...blockResults];
}

function runRule(ruleSlug: string, options: LintOptions): boolean {
  const { include, exclude } = options;
  if (include === undefined && exclude === undefined) {
    return true;
  }

  if (include && !include.includes(ruleSlug)) {
    return false;
  }

  if (exclude && exclude.includes(ruleSlug)) {
    return false;
  }

  return true;
}

function isLintComment(line: Asciidoc): boolean {
  return isComment(line) && !!line.match(/lint-(disable|ignore)/);
}

function isComment(line: Asciidoc): boolean {
  return line[0] === '/' && line[1] === '/';
}

function commentWarning(lineNumber: number): LintResult {
  return {
    line: lineNumber,
    column: false,
    type: 'warning',
    rule: 'temporary-comments',
    message:
      'Comments should generally be removed, with the exceptions of: 1) comments to disable lint rules (e.g. `// lint-disable invalid-character`), and 2) special cases where there would be a long-term value to keeping the comment (these lines can be marked with `--lint-ignore` to disable this lint warning)',
  };
}
