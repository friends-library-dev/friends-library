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

  describe('paperbackCoverBlurb()', () => {
    it('returns edition description, if exists', () => {
      edition.description = 'Modernized version of G. F.';
      expect(edition.paperbackCoverBlurb()).toBe(edition.description);
    });

    it('returns document description, if no edition description', () => {
      document.description = 'G. F.';
      expect(edition.paperbackCoverBlurb()).toBe(document.description);
    });

    it('returns friend description, if no edition or doc desc', () => {
      friend.description = 'Pure as bell, stiff as a tree';
      expect(edition.paperbackCoverBlurb()).toBe(friend.description);
    });
  });
});
