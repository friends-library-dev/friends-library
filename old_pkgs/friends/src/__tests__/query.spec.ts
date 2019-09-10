import { getFriend, getAllFriends, query } from '../query';
import { Friend, Document, Edition } from '..';

describe('getFriend()', () => {
  it('resolves a valid friend', () => {
    const george = getFriend('george-fox');
    expect(george).toBeInstanceOf(Friend);
  });

  it('sets the language on the friend', () => {
    const isaac = getFriend('isaac-penington', 'es');
    expect(isaac.lang).toBe('es');
  });
});

describe('getAllFriends()', () => {
  it('return an array of friends', () => {
    const friends = getAllFriends();

    friends.forEach(friend => {
      expect(friend).toBeInstanceOf(Friend);
    });
  });

  it('does not return the "compilations" pseudo friend', () => {
    const friends = getAllFriends();

    friends.forEach(friend => {
      expect(friend.slug).not.toBe('compilations');
    });
  });
});

describe('query', () => {
  it('can drill into a specific edition', () => {
    const { friend, document, edition } = query(
      'en',
      'george-fox',
      'journal',
      'original',
    );

    expect(friend).toBeInstanceOf(Friend);
    expect(friend.name).toBe('George Fox');
    expect(document).toBeInstanceOf(Document);
    expect(document.slug).toBe('journal');
    expect(edition).toBeInstanceOf(Edition);
    expect(edition.type).toBe('original');
  });

  it('resolves all of the audio relationships', () => {
    const { edition } = query('en', 'isaac-penington', 'writings-volume-1', 'updated');

    expect(edition.audio).not.toBeUndefined();
    expect(edition.audio!.url()).toBe(
      '/isaac-penington/writings-volume-1/updated/podcast.rss',
    );
  });
});
