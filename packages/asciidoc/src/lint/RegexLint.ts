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
}

export interface RegexLintData {
  search: RegExp;
  test: string;
  replace: string | ReplacerFn;
}

export default class RegexLint {
  protected defaults: RegexLintOptions = {
    isMaybe: false,
    fixable: true,
    langs: ['en', 'es'],
    editions: ['original', 'modernized', 'updated'],
  };

  protected data: RegexLintData & RegexLintOptions;
  public search: RegExp;
  public isMaybe: boolean;

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
  }

  public isFixable(): boolean {
    const { fixable } = this.data;
    return typeof fixable === 'function' ? fixable() : fixable;
  }

  public message(found: string): string {
    const action = this.isMaybe
      ? 'is often (but not always!) better'
      : 'should be replaced with';
    let msg = `"${found}" ${action} "${this.execReplace(found)}"`;
    if (this.data.editions.length === 3) {
      return `${msg} in all editions`;
    }
    return `${msg} in ${this.data.editions.join(' and ')} editions`;
  }

  public recommendation(match: RegExpMatchArray): string {
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
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/29789
    return str.replace(this.search, this.data.replace);
  }
}
