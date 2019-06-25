import { Url, FormatType } from '@friends-library/types';
import Edition from './Edition';

export default class Format {
  public edition: Edition;

  public constructor(public type: FormatType = 'pdf') {
    this.edition = new Edition();
  }

  public url(): Url {
    const edType = this.edition.type;
    const doc = this.edition.document;

    if (['paperback', 'audio'].includes(this.type)) {
      return `${this.edition.url()}/${this.type}`;
    }

    return `${this.edition.url()}/${doc.filename}--${edType}.${this.type}`;
  }

  public toJSON(): Format {
    delete this.edition;
    return this;
  }
}
