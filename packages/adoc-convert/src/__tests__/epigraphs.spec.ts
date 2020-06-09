import stripIndent from 'strip-indent';
import { extractEpigraphs } from '../epigraphs';

describe(`extractEpigraphs()`, () => {
  it(`extracts epigraphs`, () => {
    const adoc = stripIndent(`
      [quote.epigraph, , Cite1]
      ____
      Quote #1
      ____

      [quote.epigraph]
      ____
      Quote #2
      ____

      == A Chapter Heading

      Foobar.
    `).trim();

    const [epigraphs, shortenedAdoc] = extractEpigraphs(adoc);

    expect(epigraphs).toHaveLength(2);
    expect(epigraphs[0].source).toBe(`Cite1`);
    expect(epigraphs[0].text).toBe(`Quote #1`);
    expect(epigraphs[1].source).toBeUndefined();
    expect(epigraphs[1].text).toBe(`Quote #2`);
    expect(shortenedAdoc).toBe(`== A Chapter Heading\n\nFoobar.`);
  });
});
