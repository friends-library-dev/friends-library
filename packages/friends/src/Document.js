// @flow
import Edition from './Edition';
import Friend from './Friend';

export default class Document {
  title: string = '';
  originalTitle: string = '';
  published: ?number = null;
  slug: string = '';
  description: string = '';
  filename: string = '';
  tags: Array<string> = [];
  editions: Array<Edition> = [];
  friend: Friend;

  constructor(
    title: string = '',
    originalTitle: string = '',
    slug: string = '',
    description: string = '',
    filename: string = '',
    published: ?number = null,
    tags: Array<string> = [],
    editions: Array<Edition> = [],
  ) {
    this.title = title;
    this.originalTitle = originalTitle;
    this.slug = slug;
    this.description = description;
    this.filename = filename;
    this.published = published;
    this.tags = tags;
    this.editions = editions;
  }

  isCompilation(): boolean {
    return this.friend.slug === 'compilations';
  }

  shortestEdition(): Edition {
    return this.editions.reduce((shortest, edition) => {
      return !shortest || edition.pages < shortest.pages ? edition : shortest;
    });
  }

  hasAudio(): boolean {
    return this.editions.reduce((docHasAudio, edition) => {
      return docHasAudio || edition.formats.reduce((editionHasAudio, format) => {
        return editionHasAudio || format.type === 'audio';
      }, false);
    }, false);
  }

  hasUpdatedEdition(): boolean {
    return this.editions.reduce((hasUpdated, edition) => {
      return hasUpdated || edition.type === 'updated';
    }, false);
  }

  toJSON(): Document {
    delete this.friend;
    return this;
  }
}
