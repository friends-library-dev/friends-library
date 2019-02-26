import lint from '../lint';

describe('lint()', () => {
  it('creates a well formed lint result', () => {
    const results = lint("Ah! '`Tis thou!");
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 4,
      type: 'error',
      rule: 'smart-quotes',
      message: 'Incorrect usage of smart quotes/apostrophes',
      recommendation: "Ah! `'Tis thou!",
    });
  });

  it('new lines do not cause duplicate results', () => {
    const adoc = '== Ch 1\n\n\'`Tis so rad!!\n';
    const results = lint(adoc);
    expect(results).toHaveLength(1);
  });
});
