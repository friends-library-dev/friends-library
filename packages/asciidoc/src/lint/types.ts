import { Asciidoc, LintResult } from '@friends-library/types';

export interface LineRule {
  (line: Asciidoc, lines: Asciidoc[], lineNumber: number): LintResult[];
  slug: string;
  maybe?: boolean;
}

export interface BlockRule {
  (block: Asciidoc): LintResult[];
  slug: string;
  maybe?: boolean;
}
