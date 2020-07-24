import { Lang, EditionType, Asciidoc } from '@friends-library/types';

interface ReplacerFn {
  (substr: string, ...args: any[]): string;
}

interface FixableFn {
  (match: RegExpMatchArray, line: Asciidoc, lineNumber: number): boolean;
}

export interface RegexLintOptions {
  isMaybe: boolean;
  fixable: boolean | FixableFn;
  langs: Lang[];
  editions: EditionType[];
  message: string;
  recommend: boolean;
  includeNextLineFirstWord: boolean;
  discardIfIdenticalRecommendation: boolean;
}

export interface RegexLintData {
  search: RegExp;
  test: string;
  replace?: string | ReplacerFn;
  allowIfNear?: RegExp;
}

export default class RegexLint {
  protected defaults: RegexLintOptions = {
    isMaybe: false,
    fixable: true,
    langs: [`en`],
    editions: [`original`, `modernized`, `updated`],
    message: `"<found>" <shouldBecome> "<fixed>" <inContext>`,
    recommend: true,
    includeNextLineFirstWord: false,
    discardIfIdenticalRecommendation: false,
  };

  protected data: RegexLintData & RegexLintOptions;
  public search: RegExp;
  public isMaybe: boolean;
  public langs: Lang[];
  public editions: EditionType[];
  public allowIfNear?: RegExp;
  public includeNextLineFirstWord: boolean;
  public discardIfIdenticalRecommendation: boolean;

  /**
   * Quick and dirty test to see if we should run the full
   * regex against a line (or chunk) of asciidoc
   */
  public test: string;

  public constructor(data: RegexLintData & Partial<RegexLintOptions>) {
    this.data = { ...this.defaults, ...data };
    this.search = this.data.search;
    this.isMaybe = this.data.isMaybe;
    this.test = this.data.test;
    this.langs = this.data.langs;
    this.editions = this.data.editions;
    this.allowIfNear = this.data.allowIfNear;
    this.includeNextLineFirstWord = this.data.includeNextLineFirstWord;
    this.discardIfIdenticalRecommendation = this.data.discardIfIdenticalRecommendation;
  }

  public isFixable(match: RegExpMatchArray, line: Asciidoc, lineNumber: number): boolean {
    const { fixable } = this.data;
    return typeof fixable === `function` ? fixable(match, line, lineNumber) : fixable;
  }

  public message(found: string): string {
    const fixed = this.execReplace(found);
    const shouldBecome = this.isMaybe
      ? `is often (but not always!) better`
      : `should be replaced with`;
    let inContext = `in all editions`;
    if (this.data.editions.length < 3) {
      inContext = `in ${this.data.editions.join(` and `)} editions`;
    }
    return this.data.message
      .replace(`<found>`, found)
      .replace(`<shouldBecome>`, shouldBecome)
      .replace(`<fixed>`, fixed)
      .replace(`<inContext>`, inContext)
      .trim();
  }

  public recommendation(match: RegExpExecArray, line: string): string | undefined {
    if (!this.data.recommend) {
      return;
    }

    const index = match.index || 0;
    const parts = [
      line.substring(0, index),
      this.execReplace(line.substring(index, index + match[0].length)),
      line.substring(index + match[0].length),
    ];
    return parts.join(``);
  }

  private execReplace(str: string): string {
    const { replace } = this.data;
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/29789
    return str.replace(this.search, replace === undefined ? `???` : replace);
  }
}
