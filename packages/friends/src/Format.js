// @flow
import Edition from './Edition';
import type { Url, FormatType } from '../../../type';

export default class Format {
  type: FormatType = 'pdf';
  edition: Edition;

  constructor(type: FormatType = 'pdf') {
    this.type = type;
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
