import { getFriend } from '@friends-library/friends';
import { convert } from '../../publish/asciidoc';
import { epub } from '../';

const rebecca = getFriend('rebecca-jones');

describe('epub()', () => {

  let spec;
  let sections;

  beforeEach(() => {
    spec = {
      html: '<h2>Foo</h2>',
      lang: 'en',
      friend: rebecca,
      document: rebecca.documents[0],
      edition: rebecca.documents[0].editions[0]
    };
  });

  it('returns a META-INF dir with required container.xml', () => {
    const manifest = epub(spec);
    expect(manifest['META-INF/container.xml']).toBeDefined();
  });

  it('has mimetype file in root', () => {
    const manifest = epub(spec);
    expect(manifest.mimetype).toBe('application/epub+zip');
  });

  it('creates section files based on splitting html', () => {
    spec.html = convert('== Ch1\n\nPara.\n\n== Ch2\n\nPara.\n'); // 2 chapters

    const manifest = epub(spec);

    expect(manifest['OEBPS/sect1.xhtml']).toBeDefined();
    expect(manifest['OEBPS/sect2.xhtml']).toBeDefined();
  });
});
