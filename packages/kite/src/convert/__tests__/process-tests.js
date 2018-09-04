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
});
