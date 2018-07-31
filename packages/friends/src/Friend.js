// @flow
import Document from './Document';

type Gender = 'male' | 'female';

export default class Friend {
  name: string = '';
  slug: string = '';
  gender: Gender = 'male';
  description: string = '';
  documents: Array<Document> = [];

  constructor(
    name: string = '',
    slug: string = '',
    gender: Gender = 'male',
    description: string = '',
    documents: Array<Document> = [],
  ) {
    this.name = name;
    this.slug = slug;
    this.gender = gender;
    this.description = description;
    this.documents = documents;
  }

  isMale() {
    return this.gender === 'male';
  }

  isFemale() {
    return !this.isMale();
  }

  alphabeticalName() {
    const parts = this.name.split(' ');
    return `${parts.pop()}, ${parts.join(' ')}`;
  }
}
