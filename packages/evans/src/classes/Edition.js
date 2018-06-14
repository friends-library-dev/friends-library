// @flow
import { t } from 'c-3po';
import { LANG } from 'env';
import Format from './Format';
import Chapter from './Chapter';
import Document from './Document';
import Audio from './Audio';

type EditionType = 'original' | 'modernized' | 'updated';

export default class Edition {
  type: EditionType = 'original';
  pages: number = 0;
  formats: Array<Format> = [];
  chapters: Array<Chapter> = [];
  description: ?string;
  audio: ?Audio;
  document: Document;

  constructor(
    type: EditionType = 'original',
    pages: number = 0,
    formats: Array<Format> = [],
    chapters: Array<Chapter> = [],
    description: ?string = null,
    audio: ?Audio = null,
  ) {
    this.type = type;
    this.pages = pages;
    this.formats = formats;
    this.chapters = chapters;
    this.description = description;
    this.audio = audio;
  }

  localizedType(): string {
    if (LANG === 'en') {
      return this.type;
    }

    switch (this.type) {
      case 'updated':
        return t`updated`;
      case 'modernized':
        return t`modernized`;
      default:
        return t`original`;
    }
  }

  toJSON(): Edition {
    delete this.document;
    return this;
  }
}
