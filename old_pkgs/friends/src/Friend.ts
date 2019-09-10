import { Gender, Lang, Slug, Name, Description, Url, Uuid } from '@friends-library/types';
import Document from './Document';

export default class Friend {
  public constructor(
    public id: Uuid = '',
    public lang: Lang = 'en',
    public name: Name = '',
    public slug: Slug = '',
    public gender: Gender = 'male',
    public description: Description = '',
    public documents: Document[] = [],
  ) {}

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

  public get path(): string {
    return `${this.lang}/${this.slug}`;
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
