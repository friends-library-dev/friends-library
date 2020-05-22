import { epigraph } from '../epigraphs';

describe('epigraph()', () => {
  it('converts asciidoc syntax to html', () => {
    const epigraphs = [{ text: "Foo--'`Bar`'" }];
    const html = epigraph({ epigraphs });
    expect(html).not.toContain('`');
    expect(html).not.toContain('--');
    expect(html).toContain('&#8220;Foo&#8212;&#8216;Bar&#8217;&#8221;');
  });
});
