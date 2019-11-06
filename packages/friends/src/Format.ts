import { Url, FormatType, ArtifactType } from '@friends-library/types';
import Edition from './Edition';

export default class Format {
  public edition: Edition;

  public constructor(public type: FormatType = 'pdf') {
    this.edition = new Edition();
  }

  public url(): Url {
    if (['paperback', 'audio'].includes(this.type)) {
      return `${this.edition.url()}/${this.type}`;
    }

    return `${this.edition.url()}/${this.filename()}`;
  }

  public filename(): string {
    // @TODO this is bad
    let type: ArtifactType = 'paperback-interior';
    if (this.type === 'pdf') type = 'web-pdf';
    if (this.type === 'mobi') type = 'mobi';
    if (this.type === 'epub') type = 'epub';
    return this.edition.filename(type);
  }

  public toJSON(): Pick<Format, 'type'> {
    return { type: this.type };
  }
}
