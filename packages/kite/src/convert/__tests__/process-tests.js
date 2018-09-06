import { processAsciidoc } from '../process';

describe('processAsciidoc()', () => {
  it('escapes square brackets', () => {
    const adoc = 'Foo [bar] baz';

    const processed = processAsciidoc(adoc);

    expect(processed).toBe('Foo +++[+++bar] baz');
  });

  it('leaves footnote refs alone', () => {
    const adoc = 'Foobar.footnote:[baz]';

    const processed = processAsciidoc(adoc);

    expect(processed).toBe(adoc);
  });

  const groups = [
    ['hint of _______\'s inclination', 'hint of +++_______+++\'s inclination'],
    ['of Friends of ________,', 'of Friends of +++________+++,'],
    ['=== To _______, who had', '=== To +++_______+++, who had'],
  ];

  test.each(groups)('escapes group of underscores', (input, expected) => {
    const processed = processAsciidoc(input);

    expect(processed).toBe(expected);
  });

  it('swaps jasons horizontal rule thingies', () => {
    const adoc = '== C1\n\nPara.\n\n-------------\n\nPara';

    const processed = processAsciidoc(adoc);

    expect(processed).toBe('== C1\n\nPara.\n\n[.asterism]\n\'\'\'\n\nPara');
  });

  it('removes weird trailing number', () => {
    const adoc = '== C1\n\n33\n\n== Ch2\n\nPara2.\n\n11';

    const processed = processAsciidoc(adoc);

    expect(processed).toBe('== C1\n\n33\n\n== Ch2\n\nPara2.\n');
  });

  it('escapes start-of-para abbreviations that confuse asciidoc', () => {
    const adoc = 'Foo\n\nW. E. foobar\n';

    const processed = processAsciidoc(adoc);

    expect(processed).toBe('Foo\n\nW+++.+++ E. foobar\n');
  });

  it('escapes periods after paragraphs that start with only four-digit year', () => {
    const adoc = '== Ch1\n\n1771. I went to the meeting.';

    const processed = processAsciidoc(adoc);

    expect(processed).toBe('== Ch1\n\n1771+++.+++ I went to the meeting.');
  });
});
