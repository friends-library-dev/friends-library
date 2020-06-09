import { EditionMeta } from '@friends-library/types';

export default class DocumentMeta {
  public constructor(private data: Record<string, EditionMeta>) {}

  public has(id: string): boolean {
    return typeof this.data[id] !== `undefined`;
  }

  public get(id: string): EditionMeta | null {
    if (!this.has(id)) {
      return null;
    }

    return JSON.parse(JSON.stringify(this.data[id]));
  }

  public set(id: string, editionMeta: EditionMeta): void {
    const copy = JSON.parse(JSON.stringify(editionMeta));
    this.data[id] = copy;
  }

  public getAll(): [string, EditionMeta][] {
    return [...this];
  }

  public *[Symbol.iterator](): IterableIterator<[string, EditionMeta]> {
    for (const id of Object.keys(this.data)) {
      yield [id, JSON.parse(JSON.stringify(this.data[id]))];
    }
  }
}
