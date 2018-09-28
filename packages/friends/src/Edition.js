// @flow
import Format from './Format';
import Chapter from './Chapter';
import Document from './Document';
import Audio from './Audio';
import type { ISBN } from '../../../type';

type EditionType = 'original' | 'modernized' | 'updated';

export default class Edition {
  type: EditionType = 'original';
  pages: number = 0;
  formats: Array<Format> = [];
  chapters: Array<Chapter> = [];
  description: ?string;
  isbn: ?ISBN;
  audio: ?Audio;
  document: Document;

  constructor(
    type: EditionType = 'original',
    pages: number = 0,
    formats: Array<Format> = [],
    chapters: Array<Chapter> = [],
    description: ?string = null,
    isbn: ?ISBN = null,
    audio: ?Audio = null,
  ) {
    this.type = type;
    this.pages = pages;
    this.formats = formats;
    this.chapters = chapters;
    this.description = description;
    this.isbn = isbn;
    this.audio = audio;
  }

  toJSON(): Edition {
    delete this.document;
    return this;
  }
}
