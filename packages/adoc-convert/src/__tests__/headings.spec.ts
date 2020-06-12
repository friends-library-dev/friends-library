import { extractShortHeadings, extractHeading } from '../headings';

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

describe(`extractHeading()`, () => {
  it(`does not flag section as intermediate-title when class absent`, () => {
    const html = `
<div class="sect1 chapter--no-signed-section">
<h2 id="foo">Foobar</h2>
</div>
    `;

    const partialSection = { id: `foo`, index: 3, html };
    const section = extractHeading(partialSection, new Map());
    expect(section.isIntermediateTitle).toBe(undefined);
  });

  it(`flags section as intermediate-title when class present`, () => {
    const html = `
<div class="sect1 chapter--no-signed-section intermediate-title">
<h2 id="foo">Foobar</h2>
</div>
    `;

    const partialSection = { id: `foo`, index: 3, html };
    const section = extractHeading(partialSection, new Map());
    expect(section.isIntermediateTitle).toBe(true);
  });
});
