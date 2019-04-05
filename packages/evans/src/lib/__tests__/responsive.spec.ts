import responsiveDocumentTitle from '../responsive';

const expand = str => str
  .replace('{', '<span class="d-none d-sm-inline">')
  .replace('}', '</span>');

describe('responsiveDocumentTitle()', () => {
  it('wraps the leading "The"', () => {
    const name = 'Horrid Gardner';
    const title = 'The Life and Letters of a Wilburite Quaker';

    const result = responsiveDocumentTitle(title, name);

    expect(result).toBe(expand('{The }Life and Letters of a Wilburite Quaker'));
  });

  it('wraps "of FRIEND_NAME"', () => {
    const title = 'Unabridged, Unedited, Uncut Journal of Job Scott';
    const name = 'Job Scott';

    const result = responsiveDocumentTitle(title, name);

    expect(result).toBe(expand('Unabridged, Unedited, Uncut Journal{ of Job Scott}'));
  });

  it('removes maiden names', () => {
    const name = 'Catherine (Payton) Phillips';
    const title = 'Life and Correspondence of Catherine Phillips';

    const result = responsiveDocumentTitle(title, name);

    expect(result).toBe(expand('Life and Correspondence{ of Catherine Phillips}'));
  });

  it('removes possessive forms of name', () => {
    const name = 'Thomas Story';
    const title = "Thomas Story's Early Years & Spiritual Growth";

    const result = responsiveDocumentTitle(title, name);

    expect(result).toBe(expand("{Thomas Story's }Early Years & Spiritual Growth"));
  });

  it('does not alter titles shorter than 35 characters', () => {
    const name = 'Thomas Story';
    const title = "Thomas Story's Journal";

    const result = responsiveDocumentTitle(title, name);

    expect(result).toBe(expand("Thomas Story's Journal"));
  });

  it('only removes leading "The " if that gets it under 35 characters', () => {
    const name = 'Thomas Story';
    const title = 'The LOLOLOLOLOLOLOLOL of Thomas Story';

    const result = responsiveDocumentTitle(title, name);

    expect(result).toBe(expand('{The }LOLOLOLOLOLOLOLOL of Thomas Story'));
  });
});
