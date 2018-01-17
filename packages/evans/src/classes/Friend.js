// @flow
import Document from './Document';

export default class Friend {
  name: string = '';
  slug: string = '';
  description: string = '';
  documents: Array<Document> = [];

  constructor(
    name: string = '',
    slug: string = '',
    description: string = '',
    documents: Array<Document> = [],
  ) {
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.documents = documents;
  }
}
