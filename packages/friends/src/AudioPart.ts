import Audio from './Audio';

export default class AudioPart {
  audio: Audio;

  constructor(
    public seconds: number,
    public filesizeHq: number,
    public filesizeLq: number,
    public externalIdHq: number,
    public externalIdLq: number,
    public title: string = '',
    public chapters: number[] = [],
  ) {
    this.audio = new Audio();
  }

  toJSON(): AudioPart {
    delete this.audio;
    return this;
  }
}
