import { Friend, Document, Edition, Format } from '@friends-library/friends';
import { formatUrl } from '../url';

const friend = new Friend('fr-id', 'en', 'George Fox', 'george-fox');
const doc = new Document('doc-id', '', '', 'journal', '', 'Journal_of_George_Fox');
const edition = new Edition('original');
const format = new Format('pdf');
friend.documents = [doc];
doc.editions = [edition];
edition.formats = [format];
format.edition = edition;
edition.document = doc;
doc.friend = friend;

describe('formatUrl()', () => {
  it('should return a correctly formed function log url', () => {
    const expected =
      '/.netlify/functions/site/download/web/doc-id/en/george-fox/journal/original/pdf-web/Journal_of_George_Fox--original.pdf';
    expect(formatUrl(format)).toBe(expected);
  });
});
