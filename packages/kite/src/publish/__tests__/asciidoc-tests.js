import { prepareAsciidoc } from '../asciidoc';


describe('prepareAsciidoc()', () => {
  it('converts funky footnote newline carets', () => {
    const result = prepareAsciidoc('A para^\nfootnote:[lol] with a caret note.');

    expect(result).toBe('A parafootnote:[lol] with a caret note.');
  });

  it('converts to curly quotes', () => {
    const result = prepareAsciidoc('Hello "`good`" sir.');

    expect(result).toBe("Hello “good” sir.");
  });

  it('converts curly apostrophes', () => {
    const result = prepareAsciidoc("Hello '`good`' sir.");

    expect(result).toBe("Hello ‘good’ sir.");
  });
});
