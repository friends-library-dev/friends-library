import singlePassFix from '../fix-single-pass';
import lint from '../lint';

describe('singlePassFix()', () => {
  it('can fix a single line', () => {
    const lints = [{
      line: 1,
      fixable: true,
      recommendation: 'Foo bar.',
    }];

    const adoc = 'Foo  bar.';

    const [fixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe('Foo bar.');
  });

  it('can fix multiple lines', () => {
    const lints = [{
      line: 1,
      fixable: true,
      recommendation: 'Foo bar.',
    }, {
      line: 2,
      fixable: true,
      recommendation: 'Hash baz.',
    }];

    const adoc = 'Foo  bar.\n  Hash baz.';

    const [fixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe('Foo bar.\nHash baz.');
  });

  it('does not fix unfixable lints', () => {
    const lints = [{
      line: 1,
      fixable: false,
      recommendation: 'Foo bar.',
    }, {
      line: 2,
      fixable: true,
      // missing recommendation
    }];

    const adoc = 'Foo  bar.\n  Hash baz.';

    const [fixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe(adoc);
  });

  it('only fixes one recommendation per line', () => {
    const lints = [{
      line: 1,
      fixable: true,
      recommendation: 'Foo •bar',
    }, {
      line: 1,
      fixable: true,
      recommendation: ' Foo bar',
    }];

    const adoc = ' Foo •bar';

    const [fixed, unfixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe('Foo •bar');
    expect(unfixed).toBe(1);
  });

  it('can delete unwanted lines', () => {
    const adoc = 'Foo\n\n\nBar.\n';
    const lints = lint(adoc);

    const [fixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe('Foo\n\nBar.\n');
  });

  it('can perform multi-line fix', () => {
    const adoc = 'Hello foo-\nbar baz.\n';
    const lints = lint(adoc);

    const [fixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe('Hello\nfoo-bar baz.\n');
  });

  test('trailing hyphen fix will go unfixed if next line already modified', () => {
    const lints = [{
      line: 2,
      fixable: true,
      rule: 'trailing-whitespace',
      recommendation: 'bar.',
    }, {
      line: 1,
      fixable: true,
      rule: 'trailing-hyphen',
      recommendation: 'Hello\nfoo-bar. ',
    }];
    const adoc = 'Hello foo-\nbar. ';

    const [fixed, unfixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe('Hello foo-\nbar.');
    expect(unfixed).toBe(1);
  });

  test('trailing-hyphen multi-line fix prevents next line from being fixed', () => {
    const lints = [{
      line: 1,
      fixable: true,
      rule: 'trailing-hyphen',
      recommendation: 'Hello\nfoo-bar. ',
    }, {
      line: 2,
      fixable: true,
      rule: 'trailing-whitepsace',
      recommendation: 'bar.',
    }];
    const adoc = 'Hello foo-\nbar. ';

    const [fixed, unfixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe('Hello\nfoo-bar. ');
    expect(unfixed).toBe(1);
  });

  test('it can add extra line to end of file', () => {
    const adoc = 'Foo';
    const lints = lint(adoc);
    const [fixed, unfixed] = singlePassFix(adoc, lints);
    expect(fixed).toBe('Foo\n');
    expect(unfixed).toBe(0);
  });

  test('it can add extra line for `unspaced-class` lint', () => {
    const adoc = 'Foo\n[.foo]\nBar\n';
    const lints = lint(adoc);
    const [fixed, unfixed] = singlePassFix(adoc, lints);
    expect(fixed).toBe('Foo\n\n[.foo]\nBar\n');
    expect(unfixed).toBe(0);
  });

  it('it correctly handles multi-line fix of `join-words` rule', () => {
    const adoc = 'Foo bar every\nwhere\n';
    const lints = lint(adoc);
    const [fixed, unfixed] = singlePassFix(adoc, lints);
    expect(fixed).toBe('Foo bar\neverywhere\n');
    expect(unfixed).toBe(0);
  });

  it('it correctly handles single-line fix of `join-words` rule', () => {
    const adoc = 'Foo bar every where\n';
    const lints = lint(adoc);
    const [fixed, unfixed] = singlePassFix(adoc, lints);
    expect(fixed).toBe('Foo bar everywhere\n');
    expect(unfixed).toBe(0);
  });
});
