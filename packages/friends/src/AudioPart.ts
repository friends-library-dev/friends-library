import Audio from './Audio';

export default class AudioPart {
  public audio: Audio;

  public constructor(
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

  public toJSON(): Omit<AudioPart, 'audio' | 'toJSON'> {
    return {
      seconds: this.seconds,
      filesizeHq: this.filesizeHq,
      filesizeLq: this.filesizeLq,
      externalIdHq: this.externalIdHq,
      externalIdLq: this.externalIdLq,
      title: this.title,
      chapters: this.chapters,
    };
  }
}
