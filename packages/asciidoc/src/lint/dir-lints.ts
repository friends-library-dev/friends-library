import { Asciidoc, LintResult, FilePath } from '@friends-library/types';

interface FileLintData {
  lints: LintResult[];
  path: FilePath;
  adoc: Asciidoc;
}

export default class DirLints {
  protected map: Map<FilePath, FileLintData>;

  public constructor() {
    this.map = new Map();
  }

  public set(path: FilePath, data: { adoc: Asciidoc; lints: LintResult[] }): void {
    this.map.set(path, { ...data, path });
  }

  public get(path: FilePath): FileLintData | undefined {
    return this.map.get(path);
  }

  public fixable(): LintResult[] {
    return this.all().filter(lint => lint.fixable === true);
  }

  public unfixable(): LintResult[] {
    return this.all().filter(lint => lint.fixable !== true);
  }

  public all(): LintResult[] {
    return [...this.map].reduce(
      (acc, [, { lints }]) => {
        return [...acc, ...lints];
      },
      [] as LintResult[],
    );
  }

  public count(): number {
    return this.all().length;
  }

  public numFixable(): number {
    return this.fixable().length;
  }

  public numUnfixable(): number {
    return this.unfixable().length;
  }

  public toArray(): [FilePath, FileLintData][] {
    return [...this.map];
  }

  public [Symbol.iterator](): [FilePath, FileLintData][] {
    // @ts-ignore
    return this.map[Symbol.iterator]();
  }
}
