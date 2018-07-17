import { Format, Edition, Document, Friend, Audio } from '@friends-library/friends';
import url from '../url';

describe('url()', () => {
  let friend;
  let document;

  beforeEach(() => {
    friend = new Friend();
    friend.slug = 'rebecca-jones';
    friend.gender = 'female';
    document = new Document();
    document.slug = 'diary';
    document.filename = 'Diary';
    document.friend = friend;
    friend.documents.push(document);
  });

  it('returns correct friend url', () => {
    const friendUrl = url(friend);

    expect(friendUrl).toBe('/friend/rebecca-jones');
  });

  it('returns the correct document url', () => {
    const docUrl = url(document);

    expect(docUrl).toBe('/rebecca-jones/diary');
  });

  it('returns correct audio (podcast) urls', () => {
    const audio = new Audio();
    const edition = new Edition();
    audio.edition = edition;
    edition.type = 'updated';
    edition.audio = audio;
    edition.document = document;
    document.editions.push(edition);

    const audioUrl = url(audio);

    expect(audioUrl).toBe('/rebecca-jones/diary/updated/podcast.rss');
  });

  describe('compilation urls', () => {
    beforeEach(() => {
      friend.slug = 'compilations';
      delete friend.gender;
      document = new Document();
      document.slug = 'truth-in-the-inward-parts';
      document.filename = 'Truth_in_the_Inward_arts';
      document.friend = friend;
      friend.documents = [document];
    });

    it('returns `/compilations` for "friend" url', () => {
      expect(url(friend)).toBe('/compilations');
    });

    it('returns `/compilations/{SLUG}` for document url', () => {
      expect(url(document)).toBe('/compilations/truth-in-the-inward-parts');
    });
  });

  describe('with format', () => {
    let format;
    let edition;

    beforeEach(() => {
      format = new Format();
      format.type = 'pdf';
      edition = new Edition();
      edition.type = 'updated';
      edition.document = document;
      edition.formats.push(format);
      format.edition = edition;
    });

    it('returns download link for a downloadable asset', () => {
      const formatUrl = url(format);

      expect(formatUrl).toBe('/download/rebecca-jones/diary/updated/Diary--updated.pdf');
    });

    it('returns special audio url for audio format entity', () => {
      format.type = 'audio';
      const formatUrl = url(format);

      expect(formatUrl).toBe('/rebecca-jones/diary/updated/audio');
    });

    it('returns special paperback url for paperback format entity', () => {
      format.type = 'paperback';
      const formatUrl = url(format);

      expect(formatUrl).toBe('/rebecca-jones/diary/updated/paperback');
    });
  });
});
