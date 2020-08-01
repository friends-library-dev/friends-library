import { getFriend, getAllFriends } from '../query';
import { Friend } from '..';

describe(`getFriend()`, () => {
  it(`resolves a valid friend`, () => {
    const george = getFriend(`george-fox`);
    expect(george).toBeInstanceOf(Friend);
  });

  it(`sets the language on the friend`, () => {
    const isaac = getFriend(`isaac-penington`, `es`);
    expect(isaac.lang).toBe(`es`);
  });
});

describe(`getAllFriends()`, () => {
  it(`return an array of friends`, () => {
    const friends = getAllFriends();

    friends.forEach((friend) => {
      expect(friend).toBeInstanceOf(Friend);
    });
  });

  it(`does not return the "compilations" pseudo friend`, () => {
    const friends = getAllFriends();

    friends.forEach((friend) => {
      expect(friend.slug).not.toBe(`compilations`);
    });
  });
});
