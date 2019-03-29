import { ISBN, EditionType } from '@friends-library/types';
import Format from './Format';
import Chapter from './Chapter';
import Document from './Document';
import Audio from './Audio';

export default class Edition {
  document: Document;

  constructor(
    public type: EditionType = 'original',
    public pages: number = 0,
    public formats: Format[] = [],
    public chapters: Chapter[] = [],
    public description?: string,
    public editor?: string,
    public isbn?: ISBN,
    public audio?: Audio,
  ) {
    this.document = new Document();
  }

  toJSON(): Edition {
    delete this.document;
    return this;
  }
}
