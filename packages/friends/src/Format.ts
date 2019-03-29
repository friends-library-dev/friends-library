import { Url, FormatType } from '@friends-library/types';
import Edition from './Edition';

export default class Format {
  edition: Edition;

  constructor(public type: FormatType = 'pdf') {
    this.edition = new Edition();
  }

  url(): Url {
    const edType = this.edition.type;
    const doc = this.edition.document;

    if (['paperback', 'audio'].includes(this.type)) {
      return `${doc.url()}/${edType}/${this.type}`;
    }

    return `${doc.url()}/${edType}/${doc.filename}--${edType}.${this.type}`;
  }

  toJSON(): Format {
    delete this.edition;
    return this;
  }
}
