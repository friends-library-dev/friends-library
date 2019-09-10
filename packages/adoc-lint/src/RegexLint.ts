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
  protected defaults: RegexLintOptions = {
    isMaybe: false,
    fixable: true,
    langs: ['en'],
    editions: ['original', 'modernized', 'updated'],
    message: '"<found>" <shouldBecome> "<fixed>" <inContext>',
    recommend: true,
  };

  protected data: RegexLintData & RegexLintOptions;
  public search: RegExp;
  public isMaybe: boolean;
  public langs: Lang[];
  public editions: EditionType[];
  public allowIfNear?: RegExp;

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
  }

  public isFixable(): boolean {
    const { fixable } = this.data;
    return typeof fixable === 'function' ? fixable() : fixable;
  }

  public message(found: string): string {
    const fixed = this.execReplace(found);
    const shouldBecome = this.isMaybe
      ? 'is often (but not always!) better'
      : 'should be replaced with';
    let inContext = 'in all editions';
    if (this.data.editions.length < 3) {
      inContext = `in ${this.data.editions.join(' and ')} editions`;
    }
    return this.data.message
      .replace('<found>', found)
      .replace('<shouldBecome>', shouldBecome)
      .replace('<fixed>', fixed)
      .replace('<inContext>', inContext)
      .trim();
  }

  public recommendation(match: RegExpMatchArray): string | undefined {
    if (!this.data.recommend) {
      return;
    }

    const line = match.input || '';
    const index = match.index || 0;
    const parts = [
      line.substring(0, index),
      this.execReplace(line.substring(index, index + match[0].length)),
      line.substring(index + match[0].length),
    ];
    return parts.join('');
  }

  private execReplace(str: string): string {
    const { replace } = this.data;
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/29789
    return str.replace(this.search, replace === undefined ? '???' : replace);
  }
}
