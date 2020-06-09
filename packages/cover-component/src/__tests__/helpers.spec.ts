import { prepareTitle, prepareAuthor } from '../helpers';

describe(`prepareAuthor()`, () => {
  it(`substitutes volume info for multi-vol work with author name in title`, () => {
    const prepared = prepareAuthor(
      `Isaac Penington`,
      `Works of Isaac Penington, Volume 3`,
      false,
      `en`,
    );
    expect(prepared).toBe(`Volume III`);
  });

  it(`substitutes "Friends Library" for non-volumed compilation`, () => {
    const prepared = prepareAuthor(
      `Compilations`,
      `Truth in the Inward Parts`,
      true,
      `en`,
    );
    expect(prepared).toBe(`Friends Library`);
  });
});

describe(`prepareTitle()`, () => {
  it(`prevents names from breaking`, () => {
    const prepared = prepareTitle(`Journal of George Fox`, `George Fox`, `front`);
    expect(prepared).toBe(`Journal of George&nbsp;Fox`);
  });

  test(`Piety Promoted should get volume info stripped`, () => {
    const prepared = prepareTitle(`Piety Promoted, Volume I`, `Compilations`, `front`);
    expect(prepared).toBe(`Piety Promoted`);
  });

  test(`non compilation, non-name-including volume not stripped`, () => {
    const prepared = prepareTitle(`Foobar, Volume II`, `Bob Smith`, `front`);
    expect(prepared).toBe(`Foobar, Vol.&nbsp;II`);
  });

  test(`double-dash changed to &mdash;`, () => {
    const prepared = prepareTitle(`Foo -- Bar`, `Bob Smith`, `front`);
    expect(prepared).toBe(`Foo – Bar`);
  });

  const cases: [string, string, string, 'front' | 'spine'][] = [
    [
      `Works of Isaac Penington, Volume 2`,
      `Isaac Penington`,
      `Works of Isaac&nbsp;Penington, Vol.&nbsp;II`,
      `spine`,
    ],
    [
      `Works of Isaac Penington, Volume I`,
      `Isaac Penington`,
      `Works of Isaac&nbsp;Penington, Vol.&nbsp;I`,
      `spine`,
    ],
    [
      `Works of Isaac Penington, Volume I`,
      `Isaac Penington`,
      `Works of Isaac&nbsp;Penington`,
      `front`,
    ],
    [
      `Works of Isaac Penington, Volume 1`,
      `Isaac Penington`,
      `Works of Isaac&nbsp;Penington`,
      `front`,
    ],
    [
      `Works of Isaac Penington, Vol. IV`,
      `Isaac Penington`,
      `Works of Isaac&nbsp;Penington`,
      `front`,
    ],
    [
      // faux-volume titles come in with entity emdash
      `The Journal of George Fox &#8212; Vol. I`,
      `George Fox`,
      `The Journal of George&nbsp;Fox`,
      `front`,
    ],
    [
      `Los Escritos de Isaac Penington -- Volumen 3`,
      `Isaac Penington`,
      `Los Escritos de Isaac&nbsp;Penington`,
      `front`,
    ],
  ];

  test.each(cases)(`%s by %s => %s (on %s)`, (title, name, expected, context) => {
    const prepared = prepareTitle(title, name, context);
    expect(prepared).toBe(expected);
  });
});
