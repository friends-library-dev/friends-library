// @flow
import fs from 'fs-extra';
import { sync as glob } from 'glob';
import type { Asciidoc, LintResult, FilePath } from '../../../../type';
import { values } from '../../../../flow-utils';
import * as lineLints from './line-rules';
import * as blockLints from './block-rules';

export function lint(
  adoc: Asciidoc,
  onlyRules: null | Array<string> = null,
  excludeRules: null | Array<string> = null,
): Array<LintResult> {
  const lineRules = values(lineLints);
  const lines = adoc.split('\n');
  const lineResults = lines.reduce((acc, line, index) => {
    if (isLintComment(line)) {
      return acc;
    }

    if (isComment(line)) {
      acc.push(commentWarning(index + 1));
      return acc;
    }

    lineRules.forEach(rule => {
      if (runRule(rule, onlyRules, excludeRules)) {
        const ruleResults = rule(line, lines, index + 1);
        ruleResults.forEach(result => acc.push(result));
      }
    });
    return acc;
  }, []);

  const blockRules = values(blockLints);
  const blockResults = blockRules.reduce((acc, rule) => {
    if (!runRule(rule, onlyRules, excludeRules)) {
      return acc;
    }
    return acc.concat(...rule(adoc));
  }, []);

  return [...lineResults, ...blockResults];
}

function runRule(rule, onlyRules, excludeRules) {
  if (onlyRules === null && excludeRules === null) {
    return true;
  }

  if (onlyRules !== null && !onlyRules.includes(rule.slug)) {
    return false;
  }

  if (excludeRules !== null && excludeRules.includes(rule.slug)) {
    return false;
  }

  return true;
}

export function lintPath(
  path: FilePath,
  onlyRules: null | Array<string> = null,
  excludeRules: null | Array<string> = null,
): Map<FilePath, {|
  lints: Array<LintResult>,
  path: FilePath,
  adoc: Asciidoc,
|}> {
  const files = getFiles(path);
  const map = new Map();
  files.forEach(file => map.set(file.path, {
    lints: lint(file.adoc, onlyRules, excludeRules),
    path: file.path,
    adoc: file.adoc,
  }));

  // $FlowFixMe
  map.count = countLints.bind(map);
  return map;
}

function countLints(filter = () => true): number {
  return [...this]
    .reduce((lints, [, data]) => {
      return lints.concat(...data.lints);
    }, [])
    .filter(filter)
    .length;
}

function getFiles(path): Array<{|
  path: FilePath,
  adoc: Asciidoc,
|}> {
  let files;
  if (path.match(/\.adoc$/)) {
    if (!fs.existsSync(path)) {
      throw new Error(`<path> ${path} does not exist.`);
    }
    files = [path];
  } else {
    files = glob(`${path}/**/*.adoc`);
    if (files.length === 0) {
      throw new Error(`No files globbed from <path>: ${path}`);
    }
  }

  return files.map(file => ({
    path: file,
    adoc: fs.readFileSync(file).toString(),
  }));
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
    message: 'Comments should generally be removed, with the exceptions of: 1) comments to disable lint rules (e.g. `// lint-disable invalid-character`), and 2) special cases where there would be a long-term value to keeping the comment (these lines can be marked with `--lint-ignore` to disable this lint warning)',
  };
}
