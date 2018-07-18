import { getFriend } from '@friends-library/friends';
import { packageDocument } from '../package-document';

const rebecca = getFriend('rebecca-jones');

describe('packageDocument()', () => {

  let spec;

  beforeEach(() => {
    spec = {
      lang: 'en',
      friend: rebecca,
      document: rebecca.documents[0],
      edition: rebecca.documents[0].editions[0]
    };
  });

  it('correctly sets language', () => {
    spec.lang = 'es';
    const xml = packageDocument(spec);
    expect(xml).toContain('<dc:language id="pub-language">es</dc:language>');
  });

  it('contains the document title', () => {
    spec.document.title = 'Foobar baz';
    const xml = packageDocument(spec);
    expect(xml).toContain('<dc:title id="pub-title">Foobar baz</dc:title>');
  });

  it('contains the friend author', () => {
    spec.document.title = 'Foobar baz';
    const xml = packageDocument(spec);
    expect(xml).toContain('<dc:creator id="creator">Rebecca Jones</dc:creator>');
  });

  it('must contain dc:terms modified', () => {
    const xml = packageDocument(spec);
    expect(xml).toContain('<meta property="dcterms:modified">');
  });
});

// test html gets <html>etc...
// test manifest > item[href] must end with .xhtml
// check all tags from lots of samples, read spec, profit
// escape xml!
// file as: `<dc:creator id="creator" opf:file-as="Melville, Herman">Herman Melville</dc:creator>`
// split large books? why and what size does the spec say?
