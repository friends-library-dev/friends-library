import DirLints from '../DirLints';

describe('DirLints', () => {
  let lints: any;

  beforeEach(() => {
    lints = new DirLints();
    lints.set('/foo.adoc', {
      adoc: '',
      path: '/foo.adoc',
      lints: [
        {
          rule: 'fake-rule-1',
          fixable: true,
        },
        {
          rule: 'fake-rule-2',
        },
      ],
    });
    lints.set('/bar.adoc', {
      adoc: '',
      path: '/bar.adoc',
      lints: [
        {
          rule: 'fake-rule-3',
          fixable: true,
        },
      ],
    });
  });

  test('set/get works like a normal map', () => {
    const myLints = new DirLints();
    myLints.set('/foo.adoc', { adoc: '', lints: [] });
    expect(myLints.get('/foo.adoc')).toEqual({
      adoc: '',
      lints: [],
      path: '/foo.adoc',
    });
  });

  test('spread/toArray works, deferring to map spread', () => {
    const myLints = new DirLints();
    myLints.set('/foo.adoc', { adoc: '', lints: [] });

    const expected = [
      [
        '/foo.adoc',
        {
          adoc: '',
          lints: [],
          path: '/foo.adoc',
        },
      ],
    ];

    // @ts-ignore
    expect([...myLints]).toEqual(expected);
    expect(myLints.toArray()).toEqual(expected);
  });

  test('.fixable() returns fixable lints', () => {
    expect(lints.fixable()).toEqual([
      {
        rule: 'fake-rule-1',
        fixable: true,
      },
      {
        rule: 'fake-rule-3',
        fixable: true,
      },
    ]);
  });

  test('.unfixable() returns unfixable lints', () => {
    expect(lints.unfixable()).toEqual([
      {
        rule: 'fake-rule-2',
      },
    ]);
  });

  test('.all() return all lints', () => {
    expect(lints.all()).toEqual([
      {
        rule: 'fake-rule-1',
        fixable: true,
      },
      {
        rule: 'fake-rule-2',
      },
      {
        rule: 'fake-rule-3',
        fixable: true,
      },
    ]);
  });

  test('.count() returns num total lints', () => {
    expect(lints.count()).toBe(3);
  });

  test('.numFixable() returns count of fixable', () => {
    expect(lints.numFixable()).toBe(2);
  });

  test('.numUnfixable() returns count of unfixable', () => {
    expect(lints.numUnfixable()).toBe(1);
  });
});
