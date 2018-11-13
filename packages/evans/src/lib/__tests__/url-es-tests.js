import { Document, Friend } from '@friends-library/friends';
import url from '../url';

jest.mock('../../env', () => ({
  LANG: 'es',
}));

describe('url()', () => {
  let friend;
  let document;

  beforeEach(() => {
    friend = new Friend();
    friend.slug = 'rebecca-jones';
    friend.gender = 'female';
    document = new Document();
    document.slug = 'diary';
    document.filename = 'Diary';
    document.friend = friend;
    friend.documents.push(document);
  });

  it('returns correct friend url', () => {
    const friendUrl = url(friend);

    expect(friendUrl).toBe('/amiga/rebecca-jones');
  });

  it('returns correct friend url for a male', () => {
    friend.slug = 'george-fox';
    friend.gender = 'male';
    const friendUrl = url(friend);

    expect(friendUrl).toBe('/amigo/george-fox');
  });
});
