import Document from '../Document';
import Edition from '../Edition';
import Friend from '../Friend';

describe('Edition', () => {
  let edition: Edition;
  let document: Document;
  let friend: Friend;

  beforeEach(() => {
    edition = new Edition();
    document = new Document();
    friend = new Friend();
    document.friend = friend;
    edition.document = document;
    edition.type = 'modernized';
    document.slug = 'journal';
    friend.slug = 'george-fox';
  });

  describe('url()', () => {
    it('returns correct url', () => {
      expect(edition.url()).toBe('/george-fox/journal/modernized');
    });
  });
});
