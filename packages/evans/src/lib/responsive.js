// @flow
import { Document } from '@friends-library/friends';

const REPLACE: string = '<span class="d-none d-sm-inline">$&</span>';

export default function responsiveDocumentTitle(document: Document): string {
  let { title } = document;
  if (title.length <= 35) {
    return title;
  }

  title = title.replace(/^The /, REPLACE);
  if (document.title.length <= 39 && document.title.match(/^The /)) {
    return title;
  }

  const names = [document.friend.name];
  const nameParts = document.friend.name.split(' ');
  if (nameParts.length === 3) {
    names.push(`${nameParts[0]} ${nameParts[2]}`);
  }

  names.forEach((name) => {
    title = title.replace(` of ${name}`, REPLACE);
    title = title.replace(`${name}'s `, REPLACE);
  });

  return title;
}
