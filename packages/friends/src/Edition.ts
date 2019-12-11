import { ISBN, EditionType, ArtifactType } from '@friends-library/types';
import Document from './Document';
import { EditionData } from './types';
import { Audio } from '.';

export default class Edition {
  private _document?: Document;
  public audio?: Audio;

  public constructor(private data: Omit<EditionData, 'audio'>) {}

  public set document(document: Document) {
    this._document = document;
  }

  public get document(): Document {
    if (!this._document) throw new Error('Document not set');
    return this._document;
  }

  public get path(): string {
    return `${this.document.path}/${this.data.type}`;
  }

  public get description(): string | undefined {
    return this.data.description;
  }

  public get editor(): string | undefined {
    return this.data.editor;
  }

  public get splits(): number[] | undefined {
    return this.data.splits;
  }

  public get type(): EditionType {
    return this.data.type;
  }

  public get isbn(): ISBN {
    return this.data.isbn;
  }

  public filename(type: ArtifactType, volumeNumber?: number): string {
    const base = `${this.document.filenameBase}--${this.type}`;
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

  public get paperbackCoverBlurb(): string {
    return (
      this.description || this.document.description || this.document.friend.description
    );
  }

  public toJSON(): Omit<Edition, 'filename' | 'document' | 'toJSON'> & {
    filename: { [k in ArtifactType]: string };
  } {
    return {
      type: this.type,
      description: this.description,
      editor: this.editor,
      isbn: this.isbn,
      audio: this.audio,
      splits: this.splits,
      path: this.path,
      paperbackCoverBlurb: this.paperbackCoverBlurb,
      filename: {
        epub: this.filename('epub'),
        mobi: this.filename('mobi'),
        'web-pdf': this.filename('web-pdf'),
        'paperback-cover': this.filename('paperback-cover'),
        'paperback-interior': this.filename('paperback-interior'),
      },
    };
  }
}
