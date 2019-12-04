import { ChapterData } from './types';

export default class Chapter {
  public constructor(private data: ChapterData) {}

  public get title(): string | undefined {
    return this.data.title;
  }

  public get subtitle(): string | undefined {
    return this.data.subtitle;
  }

  public get number(): number | undefined {
    return this.data.number;
  }
}
