import lineLength from '../line-length';

describe('lineLength()', () => {
  const longLineParts = [
    'This line will be far too long and should be split at comma,',
    'for a far more pleasant reading and diffing experience,',
  ];
  const longLine = longLineParts.join(' ');

  it('errors on too long line', () => {
    const results = lineLength(longLine, [], 4);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 4,
      column: false,
      type: 'error',
      rule: 'line-length',
      message: 'Non-heading and non-list lines should not exceed 100 characters',
      recommendation: longLineParts.join('\n'),
    });
  });

  it('gives good recommendations for lines with scripture references', () => {
    const ref = '(2 Cor. 3:15-16)';
    const [result] = lineLength(`${longLine} ${ref}`);
    expect(result.recommendation).toBe(`${longLineParts.join('\n')} ${ref}`);
  });

  const allowedLongLines = [
    [`== ${longLine}`],
    [`=== ${longLine}`],
    [`==== ${longLine}`],
    [`[#foo.bar.baz.foo, short="${longLine}"]`], // not a text line
    [`// comment: ${longLine}`],
    [`* list item: ${longLine}`],
  ];

  test.each(allowedLongLines)('allows %s to exceed length', line => {
    const results = lineLength(line, [], 4);
    expect(results).toHaveLength(0);
  });
});
