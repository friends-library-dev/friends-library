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
      config: {},
    };
  });

  it('does not include original title page if no orig title', () => {
    const files = frontmatter(spec);

    expect(files['original-title']).toBeUndefined();
  });

  it('includes original title if document has original title', () => {
    spec.document.originalTitle = 'Journal of George Fox, &tc.';
    const files = frontmatter(spec);

    // uppercasing is to help mobi7 which can't CSS
    expect(files['original-title']).toContain('JOURNAL OF GEORGE FOX, &TC.');
  });

  it('does not include publish date if not specified on document', () => {
    const { copyright } = frontmatter(spec);

    expect(copyright).not.toContain('Originally published in');
  });

  it('does include publish date if specified on document', () => {
    spec.document.published = 1691;
    const { copyright } = frontmatter(spec);

    expect(copyright).toContain('Originally published in 1691');
  });

  it('includes github repo/commit/tree view link', () => {
    spec.document.slug = 'journal';
    spec.friend.slug = 'fox';
    spec.hash = '68c1187';

    const { copyright } = frontmatter(spec);

    const ghUrl = 'https://github.com/friends-library-docs/fox/tree/68c1187/journal/updated';
    expect(copyright).toContain('>68c1187</a>');
    expect(copyright).toContain(ghUrl);
  });

  it('does not add footnote helper if no footnotes', () => {
    spec.html = convert('== Chapter 1\n\nPara.\n');

    const files = frontmatter(spec);

    expect(files['footnote-helper']).toBeUndefined();
  });

  it('adds footnote helper', () => {
    spec.html = convert(prepareAsciidoc('== Chapter 1\n\nParafootnote:[foo].\n'));

    const files = frontmatter(spec);

    expect(files['footnote-helper']).toContain('footnote-helper');
  });
});
