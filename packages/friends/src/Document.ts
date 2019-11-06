import { Title, Slug, Description, Url, Uuid } from '@friends-library/types';
import Edition from './Edition';
import Friend from './Friend';

export default class Document {
  public friend: Friend;

  public constructor(
    public id: Uuid = '',
    public title: Title = '',
    public originalTitle: Title = '',
    public slug: Slug = '',
    public description: Description = '',
    public filename: string = '',
    public published?: number,
    public tags: string[] = [],
    public editions: Edition[] = [],
  ) {
    this.friend = new Friend();
  }

  public get path(): string {
    return `${this.friend.path}/${this.slug}`;
  }

  public url(): Url {
    return `/${this.friend.slug}/${this.slug}`;
  }

  public isCompilation(): boolean {
    return this.friend.slug === 'compilations';
  }

  public hasAudio(): boolean {
    return this.editions.reduce(
      (docHasAudio, edition) => {
        return (
          docHasAudio ||
          edition.formats.reduce(
            (editionHasAudio, format) => {
              return editionHasAudio || format.type === 'audio';
            },
            false as boolean,
          )
        );
      },
      false as boolean,
    );
  }

  public hasUpdatedEdition(): boolean {
    return this.editions.reduce(
      (hasUpdated, edition) => {
        return hasUpdated || edition.type === 'updated';
      },
      false as boolean,
    );
  }

  public toJSON(): Pick<
    Document,
    | 'id'
    | 'title'
    | 'originalTitle'
    | 'slug'
    | 'description'
    | 'filename'
    | 'published'
    | 'tags'
    | 'editions'
  > {
    return {
      id: this.id,
      title: this.title,
      originalTitle: this.originalTitle,
      slug: this.slug,
      description: this.description,
      filename: this.filename,
      published: this.published,
      tags: this.tags,
      editions: this.editions,
    };
  }
}
