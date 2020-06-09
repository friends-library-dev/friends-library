import { extractShortHeadings } from '../headings';

describe(`extractShortHeadings()`, () => {
  it(`extracts heading short text from adoc`, () => {
    const adoc = `[#intro, short="Intro"]\n== Introduction\n\nPara.`;
    const short = extractShortHeadings(adoc);
    expect(short).toEqual(new Map([[`intro`, `Intro`]]));
  });

  it(`extracts short heading from adoc when id also has class`, () => {
    const adoc = `[#intro.style-foo, short="Intro"]\n== Introduction\n\nPara.`;
    const short = extractShortHeadings(adoc);
    expect(short).toEqual(new Map([[`intro`, `Intro`]]));
  });

  it(`converts asciidoc syntax to html in headings`, () => {
    const adoc = `[#intro.style-foo, short="Intro--'\`Foo\`'"]\n== Introduction\n\nPara.`;
    const short = extractShortHeadings(adoc);
    expect(short).toEqual(new Map([[`intro`, `Intro&#8212;&#8216;Foo&#8217;`]]));
  });
});
