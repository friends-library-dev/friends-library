import { scopeCss } from '../helpers';

describe('scopeCss()', () => {
  // prettier-ignore
  const cases = [
    [
      `.Cover.Cover--3d {
        background: transparent;
        perspective: 2000px;
      }`,

      `.Cover--scope-TEST.Cover--3d {
        background: transparent;
        perspective: 2000px;
      }`
    ],
    [
      `.Cover.Cover .Cover--lol { color: red; }`,
      `.Cover--scope-TEST.Cover--scope-TEST .Cover--lol { color: red; }`,
    ],
    [
      `.Covers .Cover[data-rofl] { color: red; }`,
      `.Covers .Cover[data-rofl] { color: red; }`,
    ],
    [
      `.foobar .Cover,
       .rofl .lol { color: red; }`,

      `.foobar .Cover--scope-TEST,
       .rofl .lol { color: red; }`,
    ]
  ];

  test.each(cases)('css should be transformed', (before, after) => {
    expect(scopeCss(before, 'TEST')).toBe(after);
  });
});
