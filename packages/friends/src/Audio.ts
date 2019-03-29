import { Name, Url } from '@friends-library/types';
import Edition from './Edition';
import AudioPart from './AudioPart';

export default class Audio {
  edition: Edition;

  constructor(public reader: Name = '', public parts: AudioPart[] = []) {
    this.edition = new Edition();
  }

  url(): Url {
    return `${this.edition.document.url()}/${this.edition.type}/podcast.rss`;
  }

  toJSON(): Audio {
    delete this.edition;
    return this;
  }
}