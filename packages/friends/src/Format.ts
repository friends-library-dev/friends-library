import { Url, FormatType, FileType } from '@friends-library/types';
import Edition from './Edition';

export default class Format {
  public edition: Edition;

  public constructor(public type: FormatType = 'pdf') {
    this.edition = new Edition();
  }

  public url(): Url {
    if (['paperback', 'audio'].includes(this.type)) {
      return `${this.edition.url()}/${this.type}`;
    }

    return `${this.edition.url()}/${this.filename()}`;
  }

  public filename(): string {
    const fileType = <FileType>(this.type === 'pdf' ? 'pdf-web' : this.type);
    return this.edition.filename(fileType);
  }

  public toJSON(): Format {
    delete this.edition;
    return this;
  }
}
