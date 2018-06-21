// @flow
import Edition from './Edition';

type FormatType = 'pdf' | 'epub' | 'mobi' | 'audio' | 'paperback';

export default class Format {
  type: FormatType = 'pdf';
  edition: Edition;

  constructor(type: FormatType = 'pdf') {
    this.type = type;
  }

  toJSON(): Format {
    delete this.edition;
    return this;
  }
}
