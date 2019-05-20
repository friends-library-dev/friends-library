import { LintResult, Asciidoc } from '@friends-library/types';
import RegexLint, { RegexLintData, RegexLintOptions } from './RegexLint';

export default class RegexLintRunner {
  protected lints: RegexLint[];
  protected testPattern: RegExp;

  public constructor(
    lintData: (RegexLintData & Partial<RegexLintOptions>)[],
    protected ruleSlug: string,
  ) {
    this.lints = lintData.map(data => new RegexLint(data));
    this.testPattern = new RegExp(this.lints.map(l => l.test).join('|'), 'i');
  }

  public getLineLintResults(line: Asciidoc, lineNumber: number): LintResult[] {
    let results: LintResult[] = [];

    if (line === '' || !line.match(this.testPattern)) {
      return results;
    }

    this.lints.forEach(lint => {
      const matches = this.getLineMatches(lint, line);
      results = results.concat(
        matches.map(match => this.getLintResult(match, lineNumber, lint)),
      );
    });

    return results;
  }

  protected getLineMatches(lint: RegexLint, line: Asciidoc): RegExpMatchArray[] {
    const matches: RegExpMatchArray[] = [];
    if (lint.search.global) {
      let match;
      while ((match = lint.search.exec(line))) {
        matches.push(match);
      }
    } else {
      let match = lint.search.exec(line);
      if (match) matches.push(match);
    }
    return matches;
  }

  protected getLintResult(
    match: RegExpMatchArray,
    lineNumber: number,
    lint: RegexLint,
  ): LintResult {
    const recommendation = lint.recommendation(match);
    return {
      line: lineNumber,
      column: (match.index || 0) + 1 + getColumnOffset(match.input || '', recommendation),
      fixable: lint.isFixable(),
      type: 'error',
      rule: this.ruleSlug,
      message: lint.message(match[0]),
      recommendation,
    };
  }
}

function getColumnOffset(before: string, corrected: string): number {
  for (let i = 0; i < before.length; i++) {
    if (corrected[i] !== before[i]) {
      return i;
    }
  }
  return before.length;
}
