import { FriendData } from './types';
import Document from './Document';
import { Name, Lang, Uuid, Slug, Description } from '@friends-library/types';

export default class Friend {
  public documents: Document[] = [];

  public constructor(private data: Omit<FriendData, 'documents'>) {}

  public get id(): Uuid {
    return this.data.id;
  }

  public get lang(): Lang {
    return this.data.lang;
  }

  public get description(): Description {
    return this.data.description;
  }

  public get name(): Name {
    return this.data.name;
  }

  public get gender(): string {
    return this.data.gender;
  }

  public get slug(): Slug {
    return this.data.slug;
  }

  public get path(): string {
    return `${this.data.lang}/${this.data.slug}`;
  }

  public get isMale(): boolean {
    return this.data.gender === 'male';
  }

  public get isFemale(): boolean {
    return !this.isMale;
  }

  public get alphabeticalName(): string {
    const parts = this.data.name.split(' ');
    return `${parts.pop()}, ${parts.join(' ')}`;
  }

  public toJSON(): Omit<Friend, 'toJSON' | 'documents'> {
    return {
      id: this.id,
      lang: this.lang,
      description: this.description,
      name: this.name,
      gender: this.gender,
      slug: this.slug,
      path: this.path,
      isMale: this.isMale,
      isFemale: this.isFemale,
      alphabeticalName: this.alphabeticalName,
    };
  }
}
