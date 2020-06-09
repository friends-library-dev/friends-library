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
    if (!this._document) throw new Error(`Document not set`);
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

  public get isDraft(): boolean {
    return !!this.data.draft;
  }

  public get isbn(): ISBN {
    return this.data.isbn;
  }

  public filename(type: ArtifactType, volumeNumber?: number): string {
    const volSuffix = typeof volumeNumber === `number` ? `--v${volumeNumber}` : ``;
    switch (type) {
      case `epub`:
        return `${this.filenameBase}.epub`;
      case `mobi`:
        return `${this.filenameBase}.mobi`;
      case `web-pdf`:
        return `${this.filenameBase}.pdf`;
      case `paperback-interior`:
        return `${this.filenameBase}--(print)${volSuffix}.pdf`;
      case `paperback-cover`:
        return `${this.filenameBase}--cover${volSuffix}.pdf`;
    }
  }

  public get filenameBase(): string {
    return `${this.document.filenameBase}--${this.type}`;
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
      isDraft: this.isDraft,
      filenameBase: this.filenameBase,
      filename: {
        epub: this.filename(`epub`),
        mobi: this.filename(`mobi`),
        'web-pdf': this.filename(`web-pdf`),
        'paperback-cover': this.filename(`paperback-cover`),
        'paperback-interior': this.filename(`paperback-interior`),
      },
    };
  }
}
