import { Name, Url } from '@friends-library/types';
import Edition from './Edition';
import AudioPart from './AudioPart';

export default class Audio {
  public edition: Edition;

  public constructor(public reader: Name = '', public parts: AudioPart[] = []) {
    this.edition = new Edition();
  }

  public url(): Url {
    return `${this.edition.document.url()}/${this.edition.type}/podcast.rss`;
  }

  public toJSON(): Pick<Audio, 'reader' | 'parts'> {
    return {
      reader: this.reader,
      parts: this.parts,
    };
  }
}
