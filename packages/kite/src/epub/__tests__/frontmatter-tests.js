import { frontmatter } from '../frontmatter';
import { prepareAsciidoc, convert } from '../../publish/asciidoc';

describe('frontmatter()', () => {

  let spec;

  beforeEach(() => {
    spec = {
      html: '',
      document: { title: 'Journal' },
      friend: { name: 'George Fox' },
      edition: { type: 'updated' },
    };
  });

  it('does not include original title page if no orig title', () => {
    const html = frontmatter(spec);

    expect(html).not.toContain('original-title-page');
  });

  it('includes original title if document has original title', () => {
    spec.document.originalTitle = 'Journal of George Fox, &tc.';
    const html = frontmatter(spec);

    expect(html).toContain('original-title-page');
    expect(html).toContain('Journal of George Fox, &tc.');
  });

  it('does not include publish date if not specified on document', () => {
    const html = frontmatter(spec);

    expect(html).not.toContain('Originally published in');
  });

  it('does include publish date if specified on document', () => {
    spec.document.published = 1691;
    const html = frontmatter(spec);

    expect(html).toContain('Originally published in 1691');
  });

  it('includes github repo/commit/tree view link', () => {
    spec.document.slug = 'journal';
    spec.friend.slug = 'fox';
    spec.hash = '68c1187';

    const html = frontmatter(spec);

    const ghUrl = 'https://github.com/friends-library-docs/fox/tree/68c1187/journal/updated';
    expect(html).toContain('>68c1187</a>');
    expect(html).toContain(ghUrl);
  });

  it('does not add footnote helper if no footnotes', () => {
    spec.html = convert('== Chapter 1\n\nPara.\n');

    const html = frontmatter(spec);

    expect(html).not.toContain('footnote-helper');
  });

  it('adds footnote helper', () => {
    spec.html = convert(prepareAsciidoc('== Chapter 1\n\nParafootnote:[foo].\n'));

    const html = frontmatter(spec);

    expect(html).toContain('footnote-helper');
  });
});
