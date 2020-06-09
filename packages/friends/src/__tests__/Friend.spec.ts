import { testFriend } from './helpers';

describe(`Friend`, () => {
  describe(`toJSON()`, () => {
    it(`does not set a value for Friend.documents`, () => {
      const friend = testFriend();
      const json = JSON.parse(JSON.stringify(friend));

      expect(json.documents).toBeUndefined();
    });
  });

  describe(`.path`, () => {
    it(`returns combo of lang and slug`, () => {
      const friend = testFriend(f => {
        f.lang = `en`;
        f.slug = `george-fox`;
      });
      expect(friend.path).toBe(`en/george-fox`);
    });
  });

  describe(`.alphabeticalName`, () => {
    it(`returns lastname then firstname`, () => {
      const friend = testFriend(f => (f.name = `Jared Henderson`));
      expect(friend.alphabeticalName).toBe(`Henderson, Jared`);
    });

    it(`can handle maiden names`, () => {
      const friend = testFriend(f => (f.name = `Catherine (Payton) Phillips`));
      expect(friend.alphabeticalName).toBe(`Phillips, Catherine (Payton)`);
    });

    it(`can handle middle initials`, () => {
      const friend = testFriend(f => (f.name = `Sarah R. Grubb`));
      expect(friend.alphabeticalName).toBe(`Grubb, Sarah R.`);
    });
  });

  describe(`.primaryResidence`, () => {
    it(`returns un-dated residence if only one`, () => {
      const friend = testFriend(f => {
        f.residences = [
          {
            city: `Sheffield`,
            region: `England`,
          },
        ];
      });
      expect(friend.primaryResidence).toMatchObject({
        city: `Sheffield`,
        region: `England`,
      });
    });

    it(`returns residence with longest duration if several`, () => {
      const friend = testFriend(f => {
        f.born = 1700;
        f.died = 1780;
        f.residences = [
          {
            city: `York`,
            region: `England`,
            durations: [{ start: 1700, end: 1770 }],
          },
          {
            city: `Sheffield`,
            region: `England`,
            durations: [{ start: 1770, end: 1780 }],
          },
        ];
      });
      expect(friend.primaryResidence).toMatchObject({
        city: `York`,
        region: `England`,
      });
    });

    it(`discounts growing up years when choosing primary residence`, () => {
      const friend = testFriend(f => {
        f.born = 1700;
        f.died = 1724;
        f.residences = [
          {
            city: `York`,
            region: `England`,
            durations: [{ start: 1700, end: 1717 }],
          },
          {
            city: `Sheffield`,
            region: `England`,
            durations: [{ start: 1717, end: 1724 }],
          },
        ];
      });
      expect(friend.primaryResidence).toMatchObject({
        city: `Sheffield`,
        region: `England`,
      });
    });
  });
});
