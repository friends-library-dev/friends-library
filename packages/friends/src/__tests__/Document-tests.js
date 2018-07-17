import Document from '../Document';
import Edition from '../Edition';
import Format from '../Format';
import Friend from '../Friend';

describe('Document', () => {
  let document;

  beforeEach(() => {
    document = new Document();
  });

  describe('isCompilation()', () => {
    it('returns true if it belongs to the special compilations "friend"', () => {
      // console.log(getAllFriends('en', 'rebecca-jones'));
      const friend = new Friend();
      friend.slug = 'compilations';
      document.friend = friend;

      expect(document.isCompilation()).toBe(true);
    });

    it('returns false if not part of special compilations "friend"', () => {
      document.friend = new Friend();

      expect(document.isCompilation()).toBe(false);
    });
  });

  describe('shortestEdition()', () => {
    it('returns the shortest edition', () => {
      document.editions = [
        new Edition('updated', 1),
        new Edition('original', 100),
      ];

      const shortest = document.shortestEdition();

      expect(shortest.type).toBe('updated');
    });
  });

  describe('hasAudio', () => {
    beforeEach(() => {
      document.editions.push(new Edition());
    });

    it('returns true if document has one edition with audio', () => {
      document.editions[0].formats = [
        new Format('audio'),
        new Format('pdf'),
      ];

      const result = document.hasAudio();

      expect(result).toBe(true);
    });

    it('returns false if document has no edition with audio', () => {
      document.editions[0].formats = [
        new Format('mobi'),
        new Format('pdf'),
      ];

      const result = document.hasAudio();

      expect(result).toBe(false);
    });
  });

  describe('hasUpdatedEdition()', () => {
    it('returns false if document has no updated edition', () => {
      document.editions = [
        new Edition('original'),
        new Edition('modernized'),
      ];

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
