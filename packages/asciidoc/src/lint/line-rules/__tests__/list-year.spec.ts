import listYear from '../list-year';

const opts = { lang: 'en' as const };

describe('listYear()', () => {
  it('finds unescaped list items that cause asciidoc warning', () => {
    const results = listYear('* 1703. Moves to Warrington', [], 4, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 4,
      column: 7,
      type: 'error',
      rule: 'list-year',
      message:
        'The period after a year that comes first on a _list-item line_ (begins with `*`) must be escaped.',
      recommendation: '* 1703+++.+++ Moves to Warrington',
    });
  });

  it('does nothing if already escaped', () => {
    const results = listYear('* 1703+++.+++ Moves to Warrington', [], 4, opts);
    expect(results).toHaveLength(0);
  });
});
