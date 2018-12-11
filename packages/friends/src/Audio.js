// @flow
import type { Name, Url } from '../../../type';
import Edition from './Edition';
import AudioPart from './AudioPart';

export default class Audio {
  reader: Name = '';
  parts: Array<AudioPart> = [];
  edition: Edition;

  constructor(reader: Name = '', parts: Array<AudioPart> = []) {
    this.reader = reader;
    this.parts = parts;
  }

  url(): Url {
    return `${this.edition.document.url()}/${this.edition.type}/podcast.rss`;
  }

  toJSON(): Audio {
    delete this.edition;
    return this;
  }
}
