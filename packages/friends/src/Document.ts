import { DocumentData } from './types';
import Friend from './Friend';
import Edition from './Edition';
import { Slug, Uuid, Description } from '@friends-library/types';

export default class Document {
  private _friend: Friend | undefined;
  public editions: Edition[] = [];

  public constructor(private data: Omit<DocumentData, 'editions'>) {}

  public get id(): Uuid {
    return this.data.id;
  }

  public set friend(friend: Friend) {
    this._friend = friend;
  }

  public get friend(): Friend {
    if (!this._friend) throw new Error('Friend not set');
    return this._friend;
  }

  public get title(): string {
    return this.data.title;
  }

  public get description(): Description {
    return this.data.description;
  }

  public get filenameBase(): string {
    return this.data.filename;
  }

  public get originalTitle(): string | undefined {
    return this.data.original_title;
  }

  public get published(): number | undefined {
    return this.data.published;
  }

  public get tags(): DocumentData['tags'] {
    return this.data.tags;
  }

  public get slug(): Slug {
    return this.data.slug;
  }

  public get path(): string {
    return `${this.friend.path}/${this.slug}`;
  }

  public get isCompilation(): boolean {
    return this.friend.slug === 'compilations';
  }

  public get hasAudio(): boolean {
    return this.editions.reduce(
      (hasAudio, edition) => hasAudio || !!edition.audio,
      false as boolean,
    );
  }

  public get hasUpdatedEdition(): boolean {
    return this.editions.map(edition => edition.type).includes('updated');
  }

  public toJSON(): Omit<Document, 'friend' | 'toJSON'> {
    return {
      id: this.id,
      title: this.title,
      originalTitle: this.originalTitle,
      slug: this.slug,
      description: this.description,
      filenameBase: this.filenameBase,
      published: this.published,
      tags: this.tags,
      editions: this.editions,
      path: this.path,
      isCompilation: this.isCompilation,
      hasAudio: this.hasAudio,
      hasUpdatedEdition: this.hasUpdatedEdition,
    };
  }
}
