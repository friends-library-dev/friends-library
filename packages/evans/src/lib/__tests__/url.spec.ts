import { getFriend } from '@friends-library/friends';
import { formatUrl } from '../url';

const friend = getFriend('george-fox', 'en');
const doc = friend.documents[0];
const edition = doc.editions[0];
const format = edition.formats[0];

describe('formatUrl()', () => {
  it('should return a correctly formed function log url', () => {
    const expected = `/.netlify/functions/site/download/web/${doc.id}/en/george-fox/journal/original/pdf-web/Journal_of_George_Fox--original.pdf`;
    expect(formatUrl(format)).toBe(expected);
  });
});
