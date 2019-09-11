import { Lang, EditionType } from '@friends-library/types';
interface ReplacerFn {
    (substr: string, ...args: any[]): string;
}
interface FixableFn {
    (): boolean;
}
export interface RegexLintOptions {
    isMaybe: boolean;
    fixable: boolean | FixableFn;
    langs: Lang[];
    editions: EditionType[];
    message: string;
    recommend: boolean;
}
export interface RegexLintData {
    search: RegExp;
    test: string;
    replace?: string | ReplacerFn;
    allowIfNear?: RegExp;
}
export default class RegexLint {
    protected defaults: RegexLintOptions;
    protected data: RegexLintData & RegexLintOptions;
    search: RegExp;
    isMaybe: boolean;
    langs: Lang[];
    editions: EditionType[];
    allowIfNear?: RegExp;
    /**
     * Quick and dirty test to see if we should run the full
     * regex against a line (or chunk) of asciidoc
     */
    test: string;
    constructor(data: RegexLintData & Partial<RegexLintOptions>);
    isFixable(): boolean;
    message(found: string): string;
    recommendation(match: RegExpMatchArray): string | undefined;
    private execReplace;
}
export {};
