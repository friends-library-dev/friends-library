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
    document.filename = 'Journal_of_George_Fox';
    edition.document = document;
    edition.type = 'modernized';
    document.slug = 'journal';
    friend.slug = 'george-fox';
  });

  describe('filename()', () => {
    it('should give the right filename', () => {
      expect(edition.filename('pdf-print')).toBe(
        'Journal_of_George_Fox--modernized--(print).pdf',
      );

      expect(edition.filename('pdf-web')).toBe('Journal_of_George_Fox--modernized.pdf');
      expect(edition.filename('epub')).toBe('Journal_of_George_Fox--modernized.epub');
      expect(edition.filename('print-cover')).toBe(
        'Journal_of_George_Fox--modernized--cover.pdf',
      );
      expect(edition.filename('mobi')).toBe('Journal_of_George_Fox--modernized.mobi');
    });
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
