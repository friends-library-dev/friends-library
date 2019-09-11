import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
export interface LineRule {
    (line: Asciidoc, lines: Asciidoc[], lineNumber: number, options: LintOptions): LintResult[];
    slug: string;
    maybe?: boolean;
}
export interface BlockRule {
    (block: Asciidoc, options: LintOptions): LintResult[];
    slug: string;
    maybe?: boolean;
}
