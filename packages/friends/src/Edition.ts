import { ISBN, EditionType, Url, ArtifactType } from '@friends-library/types';
import Format from './Format';
import Chapter from './Chapter';
import Document from './Document';
import Audio from './Audio';

export default class Edition {
  public document: Document;

  public constructor(
    public type: EditionType = 'original',
    public formats: Format[] = [],
    public chapters: Chapter[] = [],
    public description?: string,
    public editor?: string,
    public isbn?: ISBN,
    public audio?: Audio,
    public splits?: number[],
  ) {
    this.document = new Document();
  }

  public get path(): string {
    return `${this.document.path}/${this.type}`;
  }

  public url(): Url {
    return `${this.document.url()}/${this.type}`;
  }

  public filename(type: ArtifactType, volumeNumber?: number): string {
    const base = `${this.document.filename}--${this.type}`;
    const volumeSuffix = typeof volumeNumber === 'number' ? `--v${volumeNumber}` : '';
    switch (type) {
      case 'epub':
        return `${base}.epub`;
      case 'mobi':
        return `${base}.mobi`;
      case 'web-pdf':
        return `${base}.pdf`;
      case 'paperback-interior':
        return `${base}--(print)${volumeSuffix}.pdf`;
      case 'paperback-cover':
        return `${base}--cover${volumeSuffix}.pdf`;
    }
  }

  public paperbackCoverBlurb(): string {
    return (
      this.description || this.document.description || this.document.friend.description
    );
  }

  public toJSON(): Pick<
    Edition,
    | 'type'
    | 'formats'
    | 'chapters'
    | 'description'
    | 'editor'
    | 'isbn'
    | 'audio'
    | 'splits'
  > {
    return {
      type: this.type,
      formats: this.formats,
      chapters: this.chapters,
      description: this.description,
      editor: this.editor,
      isbn: this.isbn,
      audio: this.audio,
      splits: this.splits,
    };
  }
}
