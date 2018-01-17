// @flow
import Edition from './Edition';
import Friend from './Friend';

export default class Document {
  title: string = '';
  slug: string = '';
  description: string = '';
  tags: Array<string> = [];
  editions: Array<Edition> = [];
  friend: Friend;

  constructor(
    title: string = '',
    slug: string = '',
    description: string = '',
    tags: Array<string> = [],
    editions: Array<Edition> = [],
  ) {
    this.title = title;
    this.slug = slug;
    this.description = description;
    this.tags = tags;
    this.editions = editions;
  }

  shortestEdition(): Edition {
    return this.editions.reduce((shortest, edition) => {
      return !shortest || edition.pages < shortest.pages ? edition : shortest;
    });
  }

  hasAudio(): boolean {
    return this.editions.reduce((hasAudio, edition) => {
      return hasAudio || edition.formats.reduce((editionHasAudio, format) => {
        return editionHasAudio || format.type === 'audio';
      }, false);
    }, false);
  }

  hasModernizedEdition(): boolean {
    return this.editions.reduce((hasModern, edition) => {
      return hasModern || edition.type === 'modernized';
    }, false);
  }

  toJSON(): Document {
    delete this.friend;
    return this;
  }
}
