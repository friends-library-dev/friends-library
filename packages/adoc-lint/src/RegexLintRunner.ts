import { LintResult, Asciidoc, LintOptions } from '@friends-library/types';
import RegexLint, { RegexLintData, RegexLintOptions } from './RegexLint';

export default class RegexLintRunner {
  protected lints: RegexLint[];
  protected testPattern: RegExp;
  public rule?: string;

  public constructor(
    lintData: (RegexLintData & Partial<RegexLintOptions>)[],
    options: Partial<RegexLintOptions> = {},
  ) {
    this.lints = lintData.map((data) => new RegexLint({ ...options, ...data }));
    this.testPattern = new RegExp(this.lints.map((l) => l.test).join(`|`), `i`);
  }

  public getLineLintResults(
    line: Asciidoc,
    lineNumber: number,
    lines: Asciidoc[],
    options: LintOptions,
  ): LintResult[] {
    let results: LintResult[] = [];

    if (line === `` || !line.match(this.testPattern)) {
      return results;
    }

    this.lints.forEach((lint) => {
      if (shouldLint(lint, options)) {
        const matches = this.getLineMatches(lint, line, lines, lineNumber);
        results = results.concat(
          matches
            .map((match) => this.getLintResult(match, line, lineNumber, lint))
            .filter((result) =>
              lint.discardIfIdenticalRecommendation
                ? !result.recommendation || line !== result.recommendation
                : true,
            ),
        );
      }
    });

    return results;
  }

  protected getLineMatches(
    lint: RegexLint,
    line: Asciidoc,
    lines: Asciidoc[],
    lineNumber: number,
  ): RegExpExecArray[] {
    const matches: RegExpExecArray[] = [];
    if (lint.allowIfNear && line.match(lint.allowIfNear)) {
      return matches;
    }

    if (lint.includeNextLineFirstWord && lines[lineNumber]) {
      line += ` ${lines[lineNumber].split(` `).filter(Boolean).shift() || ``}`;
      line = line.trim();
    }

    if (lint.search.global) {
      let match: RegExpExecArray | null = null;
      while ((match = lint.search.exec(line))) {
        matches.push(match);
      }
    } else {
      const match = lint.search.exec(line);
      if (match) matches.push(match);
    }
    return matches;
  }

  protected getLintResult(
    match: RegExpExecArray,
    line: Asciidoc,
    lineNumber: number,
    lint: RegexLint,
  ): LintResult {
    if (!this.rule) {
      throw new Error(`Must set RegexLintRunner.rule property`);
    }
    const recommendation = lint.recommendation(match, line);
    return {
      line: lineNumber,
      column: getColumn(match, recommendation),
      fixable: lint.isFixable(match, line, lineNumber),
      type: `error`,
      rule: this.rule,
      message: lint.message(match[0]),
      ...(recommendation ? { recommendation } : {}),
    };
  }
}

function getColumn(
  { index = 0, input: before = `` }: RegExpExecArray,
  corrected?: string,
): number {
  if (corrected === undefined) {
    return index + 1;
  }
  for (let i = 0; i < before.length; i++) {
    if (corrected[i] !== before[i]) {
      return i + 1;
    }
  }
  return before.length + 1;
}

function shouldLint(
  lint: RegexLint,
  { lang, editionType: edition, maybe }: LintOptions,
): boolean {
  if (!lint.langs.includes(lang)) {
    return false;
  }

  if (edition && !lint.editions.includes(edition)) {
    return false;
  }

  if (lint.isMaybe && !maybe) {
    return false;
  }

  return true;
}
