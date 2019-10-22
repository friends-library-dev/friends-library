import { PrintSize } from '@friends-library/types';

interface EditionMeta {
  updated: string;
  adocLength: number;
  numSections: number;
  paperback: {
    size: PrintSize;
    volumes: number[];
    pageData: {
      s: number;
      m: number;
      xl: number;
    };
  };
}

export default class DocumentMeta {
  public constructor(private data: Record<string, EditionMeta>) {}

  public has(id: string): boolean {
    return typeof this.data[id] !== 'undefined';
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

  public getAll(): EditionMeta[] {
    return JSON.parse(JSON.stringify(Object.values(this.data)));
  }
}
