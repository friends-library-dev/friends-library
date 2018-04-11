import Format from 'classes/Format';
import Edition from 'classes/Edition';
import Document from 'classes/Document';
import Friend from 'classes/Friend';
import url from '../url';

describe('url()', () => {
  let friend;
  let document;

  beforeEach(() => {
    friend = new Friend();
    friend.slug = 'rebecca-jones';
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

    it('returns special softcover url for softcover format entity', () => {
      format.type = 'softcover';
      const formatUrl = url(format);

      expect(formatUrl).toBe('/rebecca-jones/diary/updated/softcover');
    });
  });
});
