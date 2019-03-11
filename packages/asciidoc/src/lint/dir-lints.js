// @flow
import type { Asciidoc, LintResult, FilePath } from '../../../../type';

type FileLintData = {|
  lints: Array<LintResult>,
  path: FilePath,
  adoc: Asciidoc,
|};

export default class DirLints {
  map: Map<FilePath, FileLintData>

  constructor() {
    this.map = new Map();
  }

  set(path: FilePath, data: { adoc: Asciidoc, lints: Array<LintResult> }): void {
    this.map.set(path, { ...data, path });
  }

  get(path: FilePath): ?FileLintData {
    return this.map.get(path);
  }

  fixable(): Array<LintResult> {
    return this.all().filter(lint => lint.fixable === true);
  }

  unfixable(): Array<LintResult> {
    return this.all().filter(lint => lint.fixable !== true);
  }

  all(): Array<LintResult> {
    return [...this.map].reduce((acc, [_, { lints }]) => {
      return [...acc, ...lints];
    }, []);
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

  // $FlowFixMe
  [Symbol.iterator](): Array<[FilePath, FileLintData]> {
    return this.map[Symbol.iterator]();
  }
}
