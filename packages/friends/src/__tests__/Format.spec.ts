import Document from '../Document';
import Edition from '../Edition';
import Format from '../Format';
import Friend from '../Friend';

describe('Format', () => {
  let format: Format;
  let edition: Edition;
  let document: Document;
  let friend: Friend;

  beforeEach(() => {
    format = new Format();
    edition = new Edition();
    document = new Document();
    friend = new Friend();
    document.friend = friend;
    format.edition = edition;
    edition.document = document;
    document.slug = 'journal';
    friend.slug = 'george-fox';
  });

  describe('url()', () => {
    it('returns correct url for paperback', () => {
      edition.type = 'modernized';
      format.type = 'paperback';

      expect(format.url()).toBe('/george-fox/journal/modernized/paperback');
    });

    it('returns correct url for audio', () => {
      edition.type = 'modernized';
      format.type = 'audio';

      expect(format.url()).toBe('/george-fox/journal/modernized/audio');
    });

    it('returns correct url for other file types', () => {
      edition.type = 'modernized';
      format.type = 'pdf';
      document.filename = 'Journal';

      expect(format.url()).toBe('/george-fox/journal/modernized/Journal--modernized.pdf');
    });
  });
});
