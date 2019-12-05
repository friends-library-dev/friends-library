import { testFriend } from './helpers';

describe('Friend', () => {
  describe('toJSON()', () => {
    it('does not set a value for Friend.documents', () => {
      const friend = testFriend();
      const json = JSON.parse(JSON.stringify(friend));

      expect(json.documents).toBeUndefined();
    });
  });

  describe('.path', () => {
    it('returns combo of lang and slug', () => {
      const friend = testFriend(f => {
        f.lang = 'en';
        f.slug = 'george-fox';
      });
      expect(friend.path).toBe('en/george-fox');
    });
  });

  describe('alphabeticalName', () => {
    it('returns lastname then firstname', () => {
      const friend = testFriend(f => (f.name = 'Jared Henderson'));
      expect(friend.alphabeticalName).toBe('Henderson, Jared');
    });

    it('can handle maiden names', () => {
      const friend = testFriend(f => (f.name = 'Catherine (Payton) Phillips'));
      expect(friend.alphabeticalName).toBe('Phillips, Catherine (Payton)');
    });

    it('can handle middle initials', () => {
      const friend = testFriend(f => (f.name = 'Sarah R. Grubb'));
      expect(friend.alphabeticalName).toBe('Grubb, Sarah R.');
    });
  });
});
