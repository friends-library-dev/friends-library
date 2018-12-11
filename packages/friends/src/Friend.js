// @flow
import Document from './Document';
import type { Gender, Lang, Slug, Name, Description, Url } from '../../../type';

export default class Friend {
  lang: Lang = 'en';
  name: Name = '';
  slug: Slug = '';
  gender: Gender = 'male';
  description: Description = '';
  documents: Array<Document> = [];

  constructor(
    lang: Lang = 'en',
    name: Name = '',
    slug: Slug = '',
    gender: Gender = 'male',
    description: Description = '',
    documents: Array<Document> = [],
  ) {
    this.lang = lang;
    this.name = name;
    this.slug = slug;
    this.gender = gender;
    this.description = description;
    this.documents = documents;
  }

  id(): string {
    return `${this.lang}/${this.slug}`;
  }

  url(): Url {
    if (this.slug === 'compilations') {
      return '/compilations';
    }

    if (this.lang === 'en') {
      return `/friend/${this.slug}`;
    }

    const pref = this.isMale() ? 'amigo' : 'amiga';
    return `/${pref}/${this.slug}`;
  }

  isMale(): boolean {
    return this.gender === 'male';
  }

  isFemale(): boolean {
    return !this.isMale();
  }

  alphabeticalName(): string {
    const parts = this.name.split(' ');
    return `${parts.pop()}, ${parts.join(' ')}`;
  }
}
