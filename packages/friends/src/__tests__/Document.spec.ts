import Document from '../Document';
import Edition from '../Edition';
import Format from '../Format';
import Friend from '../Friend';

describe('Document', () => {
  let document: Document;
  let friend: Friend;

  beforeEach(() => {
    document = new Document();
    document.slug = 'journal';
    friend = new Friend();
    friend.lang = 'en';
    friend.slug = 'george-fox';
    document.friend = friend;
  });

  describe('url()', () => {
    it('returns url consisting of friend slug and doc slug', () => {
      expect(document.url()).toBe('/george-fox/journal');
    });
  });

  describe('path', () => {
    it('returns correct id', () => {
      expect(document.path).toBe('en/george-fox/journal');
    });
  });

  describe('isCompilation()', () => {
    it('returns true if it belongs to the special compilations "friend"', () => {
      friend.slug = 'compilations';
      expect(document.isCompilation()).toBe(true);
    });

    it('returns false if not part of special compilations "friend"', () => {
      document.friend = new Friend();

      expect(document.isCompilation()).toBe(false);
    });
  });

  describe('hasAudio', () => {
    beforeEach(() => {
      document.editions.push(new Edition());
    });

    it('returns true if document has one edition with audio', () => {
      document.editions[0].formats = [new Format('audio'), new Format('pdf')];

      const result = document.hasAudio();

      expect(result).toBe(true);
    });

    it('returns false if document has no edition with audio', () => {
      document.editions[0].formats = [new Format('mobi'), new Format('pdf')];

      const result = document.hasAudio();

      expect(result).toBe(false);
    });
  });

  describe('hasUpdatedEdition()', () => {
    it('returns false if document has no updated edition', () => {
      document.editions = [new Edition('original'), new Edition('modernized')];

      const result = document.hasUpdatedEdition();

      expect(result).toBe(false);
    });

    it('returns true if document has updated edition', () => {
      document.editions = [
        new Edition('original'),
        new Edition('modernized'),
        new Edition('updated'),
      ];

      const result = document.hasUpdatedEdition();

      expect(result).toBe(true);
    });
  });
});
