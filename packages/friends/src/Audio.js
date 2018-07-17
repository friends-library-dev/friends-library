// @flow
import Edition from './Edition';
import AudioPart from './AudioPart';

export default class Audio {
  reader: string = '';
  parts: Array<AudioPart> = [];
  edition: Edition;

  constructor(reader: string = '', parts: Array<AudioPart> = []) {
    this.reader = reader;
    this.parts = parts;
  }

  toJSON(): Audio {
    delete this.edition;
    return this;
  }
}
