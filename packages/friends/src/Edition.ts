import { ISBN, EditionType, Url, FileType } from '@friends-library/types';
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

  public get path(): string {
    return `${this.document.path}/${this.type}`;
  }

  public url(): Url {
    return `${this.document.url()}/${this.type}`;
  }

  public filename(type: FileType | 'print-cover'): string {
    const base = `${this.document.filename}--${this.type}`;
    switch (type) {
      case 'epub':
        return `${base}.epub`;
      case 'mobi':
        return `${base}.mobi`;
      case 'pdf-web':
        return `${base}.pdf`;
      case 'pdf-print':
        return `${base}--(print).pdf`;
      case 'print-cover':
        return `${base}--cover.pdf`;
    }
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
