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

  public get imageFilename(): string {
    return `${this.edition.filenameBase}--audio.png`;
  }

  public get imagePath(): string {
    return `${this.edition.path}/${this.imageFilename}`;
  }

  public get externalPlaylistId(): number | undefined {
    return this.data.external_playlist_id_hq;
  }

  public get externalPlaylistIdHq(): number | undefined {
    return this.externalPlaylistId;
  }

  public get externalPlaylistIdLq(): number | undefined {
    return this.data.external_playlist_id_lq;
  }

  public toJSON(): Omit<Audio, 'edition' | 'toJSON'> {
    return {
      reader: this.reader,
      parts: this.parts,
      imageFilename: this.imageFilename,
      imagePath: this.imagePath,
      externalPlaylistId: this.externalPlaylistId,
      externalPlaylistIdHq: this.externalPlaylistIdHq,
      externalPlaylistIdLq: this.externalPlaylistIdLq,
    };
  }
}
