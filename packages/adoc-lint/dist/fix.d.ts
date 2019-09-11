import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
export default function fix(adoc: Asciidoc, options?: LintOptions): {
    fixed: Asciidoc;
    numFixed: number;
    unfixable: LintResult[];
};
