import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import { LineRule, BlockRule } from './types';
import * as lineLints from './line-rules';
import * as blockLints from './block-rules';

export default function lint(
  adoc: Asciidoc,
  options: LintOptions = { lang: `en` },
): LintResult[] {
  const lineRules: LineRule[] = Object.values(lineLints);
  const lines = adoc.split(`\n`);
  const lineResults = lines.reduce((acc, line, index) => {
    if (isLintComment(line)) {
      return acc;
    }

    if (isComment(line)) {
      acc.push(commentWarning(index + 1));
      return acc;
    }

    lineRules.forEach(rule => {
      if (runRule(rule, options, lines[index - 1])) {
        const ruleResults = rule(line, lines, index + 1, options);
        ruleResults.forEach(result => acc.push(result));
      }
    });
    return acc;
  }, [] as LintResult[]);

  const blockRules: BlockRule[] = Object.values(blockLints);
  const blockResults = blockRules.reduce((acc, rule) => {
    if (!runRule(rule, options)) {
      return acc;
    }
    return acc.concat(...rule(adoc, options));
  }, [] as LintResult[]);

  return [...lineResults, ...blockResults];
}

function runRule(
  rule: LineRule | BlockRule,
  options: LintOptions,
  prevLine?: Asciidoc,
): boolean {
  const { include, exclude } = options;

  if (rule.maybe && !options.maybe && !(include || []).includes(rule.slug)) {
    return false;
  }

  if (disabledByComment(rule.slug, prevLine)) {
    return false;
  }

  if (include === undefined && exclude === undefined) {
    return true;
  }

  if (include && !include.includes(rule.slug)) {
    return false;
  }

  if (exclude && exclude.includes(rule.slug)) {
    return false;
  }

  return true;
}

function disabledByComment(ruleSlug: string, prevLine?: Asciidoc): boolean {
  return !!(
    prevLine &&
    prevLine[0] === `/` &&
    prevLine.match(new RegExp(`^// lint-disable .*${ruleSlug}`))
  );
}

function isLintComment(line: Asciidoc): boolean {
  return isComment(line) && !!line.match(/lint-(disable|ignore)/);
}

function isComment(line: Asciidoc): boolean {
  return line[0] === `/` && line[1] === `/`;
}

function commentWarning(lineNumber: number): LintResult {
  return {
    line: lineNumber,
    column: false,
    type: `warning`,
    rule: `temporary-comments`,
    message: `Comments should generally be removed, with the exceptions of: 1) comments to disable lint rules (e.g. \`// lint-disable invalid-characters\`), and 2) special cases where there would be a long-term value to keeping the comment (these lines can be marked with \`--lint-ignore\` to disable this lint warning)`,
  };
}
