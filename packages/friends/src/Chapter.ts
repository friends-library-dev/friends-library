type ChapterData = {
  title?: string;
  subtitle?: string;
  number?: number;
}

export default class Chapter {
  public title?: string;
  public number?: number;
  public subtitle?: string;

  constructor(data: ChapterData) {
    if (data.title && data.number) {
      throw new Error('Chapter may not have both a title and a number');
    }

    if (data.title === undefined && data.number === undefined) {
      throw new Error('Chapter must have either a title or a number');
    }
    
    if (data.title !== undefined) {
      this.title = data.title;
    }

    if (data.number !== undefined) {
      this.number = data.number;
    }

    if (data.subtitle !== undefined) {
      this.subtitle = data.subtitle;
    }
  }
}
