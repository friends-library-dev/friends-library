import { Gender, Lang, Slug, Name, Description, Url } from '@friends-library/types';
import Document from './Document';

export default class Friend {
  public lang: Lang = 'en';
  public name: Name = '';
  public slug: Slug = '';
  public gender: Gender = 'male';
  public description: Description = '';
  public documents: Document[] = [];

  public constructor(
    lang: Lang = 'en',
    name: Name = '',
    slug: Slug = '',
    gender: Gender = 'male',
    description: Description = '',
    documents: Document[] = [],
  ) {
    this.lang = lang;
    this.name = name;
    this.slug = slug;
    this.gender = gender;
    this.description = description;
    this.documents = documents;
  }

  public id(): string {
    return `${this.lang}/${this.slug}`;
  }

  public url(): Url {
    if (this.slug === 'compilations') {
      return '/compilations';
    }

    if (this.lang === 'en') {
      return `/friend/${this.slug}`;
    }

    const pref = this.isMale() ? 'amigo' : 'amiga';
    return `/${pref}/${this.slug}`;
  }

  public isMale(): boolean {
    return this.gender === 'male';
  }

  public isFemale(): boolean {
    return !this.isMale();
  }

  public alphabeticalName(): string {
    const parts = this.name.split(' ');
    return `${parts.pop()}, ${parts.join(' ')}`;
  }
}
