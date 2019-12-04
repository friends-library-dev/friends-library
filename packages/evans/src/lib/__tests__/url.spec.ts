import { logDownloadUrl } from '../url';
import { getFriend } from '@friends-library/friends';

describe('logDownloadUrl()', () => {
  it('should return a correctly formed function log url', () => {
    const george = getFriend('george-fox');
    const doc = george.documents[0];
    const edition = doc.editions[0];
    const expected = `/.netlify/functions/site/download/web/${doc.id}/en/george-fox/${
      doc.slug
    }/${edition.type}/web-pdf/${edition.filename('web-pdf')}`;
    expect(logDownloadUrl(edition, 'web-pdf')).toBe(expected);
  });
});
