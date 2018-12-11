// @flow
import Edition from './Edition';
import Friend from './Friend';
import type { Title, Slug, Description, Url } from '../../../type';

export default class Document {
  title: Title = '';
  originalTitle: Title = '';
  published: ?number = null;
  slug: Slug = '';
  description: Description = '';
  filename: string = '';
  tags: Array<string> = [];
  editions: Array<Edition> = [];
  friend: Friend;

  constructor(
    title: Title = '',
    originalTitle: Title = '',
    slug: Slug = '',
    description: Description = '',
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

  id(): string {
    return `${this.friend.id()}/${this.slug}`;
  }

  url(): Url {
    return `/${this.friend.slug}/${this.slug}`;
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
