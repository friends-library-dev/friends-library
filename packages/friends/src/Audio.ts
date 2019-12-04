import { Name } from '@friends-library/types';
import Edition from './Edition';
import AudioPart from './AudioPart';
import { AudioData } from './types';

export default class Audio {
  private _edition?: Edition;
  public parts: AudioPart[] = [];

  public constructor(private data: Omit<AudioData, 'parts'>) {}

  public set edition(edition: Edition) {
    this._edition = edition;
  }

  public get edition(): Edition {
    if (!this._edition) throw new Error('Edition not set');
    return this._edition;
  }

  public get reader(): Name {
    return this.data.reader;
  }

  public toJSON(): Omit<Audio, 'edition' | 'toJSON'> {
    return {
      reader: this.reader,
      parts: this.parts,
    };
  }
}
