import { getFriend } from '@friends-library/friends';
import { convert } from '../../publish/asciidoc';
import { epub, M7BR } from '../';

const rebecca = getFriend('rebecca-jones');

describe('epub()', () => {

  let spec;
  let sections;
  let cmd;

  beforeEach(() => {
    spec = {
      html: '<h2>Foo</h2>',
      lang: 'en',
      friend: rebecca,
      document: rebecca.documents[0],
      edition: rebecca.documents[0].editions[0]
    };

    cmd = {
      perform: true,
      check: false,
    };
  });

  it('returns a META-INF dir with required container.xml', () => {
    const manifest = epub(spec, cmd);
    expect(manifest['META-INF/container.xml']).toBeDefined();
  });

  it('has mimetype file in root', () => {
    const manifest = epub(spec, cmd);
    expect(manifest.mimetype).toBe('application/epub+zip');
  });

  it('creates section files based on splitting html', () => {
    spec.html = convert('== Ch1\n\nPara.\n\n== Ch2\n\nPara.\n'); // 2 chapters

    const manifest = epub(spec, cmd);

    expect(manifest['OEBPS/sect1.xhtml']).toBeDefined();
    expect(manifest['OEBPS/sect2.xhtml']).toBeDefined();
  });

  test('css file has no kf8 for target epub', () => {
    spec.target = 'epub';

    const manifest = epub(spec, cmd);

    expect(manifest['OEBPS/style.css']).not.toContain('@media amzn-kf8 ');
  });

  test('css file has kf8 media query for target mobi', () => {
    spec.target = 'mobi';

    const manifest = epub(spec, cmd);

    expect(manifest['OEBPS/style.css']).toContain('@media amzn-kf8 ');
  });

  test('half-title for epub has no <br> tags', () => {
    spec.target = 'epub';

    const manifest = epub(spec, cmd);

    expect(manifest['OEBPS/half-title.xhtml']).not.toContain('<br class="m7"/>');
    expect(manifest['OEBPS/half-title.xhtml']).not.toContain(M7BR);
  });

  test('half-title for mobi has gets sad <br> tags', () => {
    spec.target = 'mobi';

    const manifest = epub(spec, cmd);

    expect(manifest['OEBPS/half-title.xhtml']).toContain('<br class="m7"/>');
  });
});
