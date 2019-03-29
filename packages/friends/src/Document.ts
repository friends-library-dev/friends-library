// @flow
import { Title, Slug, Description, Url } from '@friends-library/types';
import Edition from './Edition';
import Friend from './Friend';

export default class Document {
  friend: Friend;

  constructor(
    public title: Title = '',
    public originalTitle: Title = '',
    public slug: Slug = '',
    public description: Description = '',
    public filename: string = '',
    public published?: number,
    public tags: Array<string> = [],
    public editions: Array<Edition> = [],
  ) {
    this.friend = new Friend();
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
      }, false as boolean);
    }, false as boolean);
  }

  hasUpdatedEdition(): boolean {
    return this.editions.reduce((hasUpdated, edition) => {
      return hasUpdated || edition.type === 'updated';
    }, false as boolean);
  }

  toJSON(): Document {
    delete this.friend;
    return this;
  }
}
