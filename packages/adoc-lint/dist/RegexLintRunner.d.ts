import { LintResult, Asciidoc, LintOptions } from '@friends-library/types';
import RegexLint, { RegexLintData, RegexLintOptions } from './RegexLint';
export default class RegexLintRunner {
    protected lints: RegexLint[];
    protected testPattern: RegExp;
    rule?: string;
    constructor(lintData: (RegexLintData & Partial<RegexLintOptions>)[], options?: Partial<RegexLintOptions>);
    getLineLintResults(line: Asciidoc, lineNumber: number, options: LintOptions): LintResult[];
    protected getLineMatches(lint: RegexLint, line: Asciidoc): RegExpMatchArray[];
    protected getLintResult(match: RegExpMatchArray, lineNumber: number, lint: RegexLint): LintResult;
}
