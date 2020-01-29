import { artifactDownloadUrl } from '../url';
import { getFriend } from '@friends-library/friends';

describe('artifactDownloadUrl()', () => {
  it('should return a correctly formed function log url', () => {
    const george = getFriend('george-fox');
    const doc = george.documents[0];
    const edition = doc.editions[0];
    const expected = `/.netlify/functions/site/log/download/${doc.id}/en/george-fox/${
      doc.slug
    }/${edition.type}/web-pdf/${edition.filename('web-pdf')}`;
    expect(artifactDownloadUrl(edition, 'web-pdf')).toBe(expected);
  });
});
