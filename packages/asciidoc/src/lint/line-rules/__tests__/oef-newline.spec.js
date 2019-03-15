import eofNewline from '../eof-newline';

describe('eofNewline()', () => {
  it('lints last line that is not empty', () => {
    const adoc = 'Foo\nbar.';
    const lines = adoc.split('\n');
    const results = eofNewline(lines[1], lines, 2);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 2,
      column: false,
      type: 'error',
      rule: 'eof-newline',
      fixable: true,
      message: 'Files must end with a single blank line',
      recommendation: '--> add a new line to the end of the file',
    });
  });

  test('empty last line is OK', () => {
    const adoc = 'Foo\nbar.\n';
    const lines = adoc.split('\n');
    const results = eofNewline(lines[2], lines, 3);
    expect(results).toHaveLength(0);
  });
});
