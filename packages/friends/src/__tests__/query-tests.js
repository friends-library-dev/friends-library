import { getFriend, getAllFriends, query } from '../query';
import { Friend, Document, Edition } from '..';

describe('getFriend()', () => {
  it('resolves a valid friend', () => {
    const george = getFriend('george-fox');

    expect(george).toBeInstanceOf(Friend);
  });
});

describe('getAllFriends()', () => {
  it('return an array of friends', () => {
    const friends = getAllFriends();

    friends.forEach(friend => {
      expect(friend).toBeInstanceOf(Friend);
    });
  });

  it('does note return the "compilations" pseudo friend', () => {
    const friends = getAllFriends();

    friends.forEach(friend => {
      expect(friend.slug).not.toBe('compilations');
    });
  });
});


describe('query', () => {
  it('can drill into a specific edition', () => {
    const { friend, document, edition } = query('en', 'george-fox', 'journal', 'original');

    expect(friend).toBeInstanceOf(Friend);
    expect(friend.name).toBe('George Fox');
    expect(document).toBeInstanceOf(Document);
    expect(document.slug).toBe('journal');
    expect(edition).toBeInstanceOf(Edition);
    expect(edition.type).toBe('original');
  });
});
