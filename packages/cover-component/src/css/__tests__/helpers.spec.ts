import { scopeCss, scaleCssInches, spineAuthorDisplay } from '../helpers';
import { PrintSize } from '@friends-library/types';

describe(`scopeCss()`, () => {
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

  test.each(cases)(`css should be transformed`, (before, after) => {
    expect(scopeCss(before, `TEST`)).toBe(after);
  });
});

describe(`scaleCssInches()`, () => {
  const cases: [number, string, string][] = [
    [
      0.5,
      `.Cover .foobarverylong { width: 1in; }`,
      `.Cover .foobarverylong { width: 0.5in; }`,
    ],
    [
      0.5,
      `.Cover .front_main .foo { color: red; }`,
      `.Cover .front_main .foo { color: red; }`, // prevent .front_main0 .foo
    ],
    [
      0.5,
      `.Cover .foo { transform: rotateX(90deg) translateZ(1in); }`,
      `.Cover .foo { transform: rotateX(90deg) translateZ(0.5in); }`,
    ],
  ];

  test.each(cases)(`css inches should be scaled`, (scaler, before, after) => {
    expect(scaleCssInches(before, scaler)).toBe(after);
  });
});

describe(`spineAuthorDisplay()`, () => {
  const spineAuthorDisplayCases: [string, string, PrintSize, boolean][] = [
    [`The Life and Letters of John&nbsp;Fothergill`, `John Fothergill`, `m`, true],
    [`The Life and Letters of Catherine&nbsp;Payton`, `Catherine Payton`, `m`, true],
    [`The Christian Progress of George&nbsp;Whitehead`, `George Whitehead`, `m`, false],
    // all of the `W`s should be factored as making it longer
    [`The Journal and Writings of John&nbsp;Woolman`, `John Woolman`, `m`, false],
  ];

  test.each(spineAuthorDisplayCases)(
    `spine author display for "%s"`,
    (title, author, size, display) => {
      expect(spineAuthorDisplay(title, author, size, false)).toBe(
        display ? `block` : `none`,
      );
    },
  );
});
