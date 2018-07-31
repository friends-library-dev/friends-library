import Document from '../Document';
import Friend from '../Friend';

describe('Friend', () => {
  let friend;

  beforeEach(() => {
    friend = new Friend();
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
