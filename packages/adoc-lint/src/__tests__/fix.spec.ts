import fix from '../fix';

describe('fix()', () => {
  it('can recursively fix multiple violations', () => {
    const adoc = '==  Chapter 1 ';
    const { fixed, numFixed, unfixable } = fix(adoc);
    expect(fixed).toBe('== Chapter 1\n');
    expect(numFixed).toBe(3);
    expect(unfixable).toEqual([]);
  });
});
