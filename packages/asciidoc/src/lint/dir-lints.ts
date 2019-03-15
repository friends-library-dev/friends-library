import { Asciidoc, LintResult, FilePath } from '@friends-library/types';

type FileLintData = {
  lints: LintResult[];
  path: FilePath;
  adoc: Asciidoc;
};

export default class DirLints {
  map: Map<FilePath, FileLintData>;

  constructor() {
    this.map = new Map();
  }

  set(path: FilePath, data: { adoc: Asciidoc; lints: LintResult[] }): void {
    this.map.set(path, { ...data, path });
  }

  get(path: FilePath) {
    return this.map.get(path);
  }

  fixable(): LintResult[] {
    return this.all().filter(lint => lint.fixable === true);
  }

  unfixable(): LintResult[] {
    return this.all().filter(lint => lint.fixable !== true);
  }

  all(): LintResult[] {
    return [...this.map].reduce(
      (acc, [_, { lints }]) => {
        return [...acc, ...lints];
      },
      [] as LintResult[],
    );
  }

  count(): number {
    return this.all().length;
  }

  numFixable(): number {
    return this.fixable().length;
  }

  numUnfixable(): number {
    return this.unfixable().length;
  }

  toArray(): Array<[FilePath, FileLintData]> {
    return [...this.map];
  }

  [Symbol.iterator](): Array<[FilePath, FileLintData]> {
    // @ts-ignore
    return this.map[Symbol.iterator]();
  }
}
