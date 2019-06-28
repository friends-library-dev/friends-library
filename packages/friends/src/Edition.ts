import { ISBN, EditionType, Url } from '@friends-library/types';
import Format from './Format';
import Chapter from './Chapter';
import Document from './Document';
import Audio from './Audio';

export default class Edition {
  public document: Document;

  public constructor(
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

  public url(): Url {
    return `${this.document.url()}/${this.type}`;
  }

  public paperbackCoverBlurb(): string {
    return (
      this.description || this.document.description || this.document.friend.description
    );
  }

  public toJSON(): Edition {
    delete this.document;
    return this;
  }
}
