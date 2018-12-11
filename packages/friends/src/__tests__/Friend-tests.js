import Document from '../Document';
import Friend from '../Friend';

describe('Friend', () => {
  let friend;

  beforeEach(() => {
    friend = new Friend();
    friend.lang = 'en';
    friend.slug = 'george-fox';
  });

  describe('toJSON()', () => {
    it('removes circular reference to documents[*].friend', () => {
      const document = new Document();
      document.friend = friend;
      friend.documents.push(document);

      const json = JSON.parse(JSON.stringify(friend));

      expect(json.documents[0].friend).toBeUndefined();
    });
  });

  describe('.id()', () => {
    it('returns combo of lang and slug', () => {
      expect(friend.id()).toBe('en/george-fox');
    });
  });

  describe('.url()', () => {
    it('returns correct relative url', () => {
      expect(friend.url()).toBe('/friend/george-fox');
    });

    it('returns special url for compilations pseudo-friend', () => {
      friend.slug = 'compilations';
      expect(friend.url()).toBe('/compilations');
    });

    it('returns correct url for spanish male', () => {
      friend.lang = 'es';
      friend.slug = 'isaac-penington';
      friend.gender = 'male';
      expect(friend.url()).toBe('/amigo/isaac-penington');
    });

    it('returns correct url for spanish male', () => {
      friend.lang = 'es';
      friend.slug = 'rebecca-jones';
      friend.gender = 'female';
      expect(friend.url()).toBe('/amiga/rebecca-jones');
    });
  });

  describe('isMale()', () => {
    it('returns true if gender is male', () => {
      friend.gender = 'male';

      expect(friend.isMale()).toBe(true);
    });

    it('returns false if gender is female', () => {
      friend.gender = 'female';

      expect(friend.isMale()).toBe(false);
    });
  });

  describe('alphabeticalName()', () => {
    it('returns lastname then firstname', () => {
      friend.name = 'Jared Henderson';

      expect(friend.alphabeticalName()).toBe('Henderson, Jared');
    });

    it('can handle maiden names', () => {
      friend.name = 'Catherine (Payton) Phillips';

      expect(friend.alphabeticalName()).toBe('Phillips, Catherine (Payton)');
    });

    it('can handle middle initials', () => {
      friend.name = 'Sarah R. Grubb';

      expect(friend.alphabeticalName()).toBe('Grubb, Sarah R.');
    });
  });
});
