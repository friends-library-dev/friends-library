import { htmlTitle, htmlShortTitle } from '../utils';

describe(`htmlTitle`, () => {
  it(`should turn double-dash into emdash entity`, () => {
    expect(htmlTitle(`Foo -- bar`)).toBe(`Foo &#8212; bar`);
  });

  it(`should change trailing digits into roman numerals`, () => {
    expect(htmlTitle(`Foo 3`)).toBe(`Foo III`);
  });
});

describe(`htmlShortTitle`, () => {
  it(`should shorten volume to Vol.`, () => {
    expect(htmlShortTitle(`Foo -- Volume 1`)).toBe(`Foo &#8212; Vol.&#160;I`);
  });

  it(`should shorten spanish volumen to Vol.`, () => {
    expect(htmlShortTitle(`Foo -- volumen 4`)).toBe(`Foo &#8212; Vol.&#160;IV`);
  });
});
