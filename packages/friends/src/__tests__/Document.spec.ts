import { firstDoc } from './helpers';

describe('Document', () => {
  describe('path', () => {
    it('returns correct path', () => {
      const doc = firstDoc(f => {
        f.slug = 'george-fox';
        f.lang = 'en';
        f.documents[0].slug = 'journal';
      });
      expect(doc.path).toBe('en/george-fox/journal');
    });
  });

  describe('isCompilation', () => {
    it('returns true if it belongs to the special compilations "friend"', () => {
      const doc = firstDoc(f => (f.slug = 'compilations'));
      expect(doc.isCompilation).toBe(true);
    });

    it('returns false if not part of special compilations "friend"', () => {
      const doc = firstDoc(f => (f.slug = 'george-fox'));
      expect(doc.isCompilation).toBe(false);
    });
  });

  describe('hasAudio', () => {
    it('returns true if document has one edition with audio', () => {
      const doc = firstDoc(f => {
        f.documents[0].editions[0].audio = {
          reader: 'Jason Henderson',
          parts: [],
        };
      });
      expect(doc.hasAudio).toBe(true);
    });

    it('returns false if document has no edition with audio', () => {
      expect(firstDoc().hasAudio).toBe(false);
    });
  });

  describe('hasUpdatedEdition()', () => {
    it('returns false if document has no updated edition', () => {
      const doc = firstDoc(f => {
        f.documents[0].editions = f.documents[0].editions.filter(
          e => e.type === 'original',
        );
      });
      expect(doc.hasUpdatedEdition).toBe(false);
    });

    it('returns true if document has updated edition', () => {
      const doc = firstDoc(f => (f.documents[0].editions[0].type = 'updated'));
      expect(doc.hasUpdatedEdition).toBe(true);
    });
  });
});
