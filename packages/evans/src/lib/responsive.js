// @flow
import type { Title, Name, Html } from '../../../../type';

const REPLACE: string = '<span class="d-none d-sm-inline">$&</span>';

export default function responsiveDocumentTitle(
  originalTitle: Title,
  friendName: Name,
): Html {
  let title = originalTitle;
  if (title.length <= 35) {
    return title;
  }

  title = title.replace(/^The /, REPLACE);
  if (originalTitle.length <= 39 && originalTitle.match(/^The /)) {
    return title;
  }

  const names = [friendName];
  const nameParts = friendName.split(' ');
  if (nameParts.length === 3) {
    names.push(`${nameParts[0]} ${nameParts[2]}`);
  }

  names.forEach((name) => {
    title = title.replace(` of ${name}`, REPLACE);
    title = title.replace(`${name}'s `, REPLACE);
  });

  return title;
}
