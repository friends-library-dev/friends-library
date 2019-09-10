import Document from '../Document';
import Edition from '../Edition';
import Friend from '../Friend';
import Audio from '../Audio';

describe('Audio', () => {
  let edition: Edition;
  let document: Document;
  let friend: Friend;
  let audio: Audio;

  beforeEach(() => {
    audio = new Audio();
    edition = new Edition();
    document = new Document();
    friend = new Friend();
    document.friend = friend;
    edition.document = document;
    edition.audio = audio;
    audio.edition = edition;
    document.slug = 'journal';
    friend.slug = 'george-fox';
    edition.type = 'modernized';
  });

  describe('url()', () => {
    it('returns correct url', () => {
      expect(audio.url()).toBe('/george-fox/journal/modernized/podcast.rss');
    });
  });
});
