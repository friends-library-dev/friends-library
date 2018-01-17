// @flow
import Document from 'classes/Document';
import Friend from 'classes/Friend';
import responsiveDocumentTitle from '../responsive';

const expand = str => str
  .replace('{', '<span class="d-none d-sm-inline">')
  .replace('}', '</span>');

describe('responsiveDocumentTitle()', () => {
  let doc;
  let friend;

  beforeEach(() => {
    doc = new Document();
    friend = new Friend();
    friend.name = 'Mehetabel Jenkins';
    doc.friend = friend;
  });

  it('wraps the leading "The"', () => {
    doc.title = 'The Life and Letters of a Wilburite Quaker';

    const result = responsiveDocumentTitle(doc);

    expect(result).toBe(expand('{The }Life and Letters of a Wilburite Quaker'));
  });

  it('wraps "of FRIEND_NAME"', () => {
    doc.title = 'Unabridged, Unedited, Uncut Journal of Job Scott';
    friend.name = 'Job Scott';

    const result = responsiveDocumentTitle(doc);

    expect(result).toBe(expand('Unabridged, Unedited, Uncut Journal{ of Job Scott}'));
  });

  it('removes maiden names', () => {
    friend.name = 'Catherine (Payton) Phillips';
    doc.title = 'Life and Correspondence of Catherine Phillips';

    const result = responsiveDocumentTitle(doc);

    expect(result).toBe(expand('Life and Correspondence{ of Catherine Phillips}'));
  });

  it('removes possessive forms of name', () => {
    friend.name = 'Thomas Story';
    doc.title = "Thomas Story's Early Years & Spiritual Growth";

    const result = responsiveDocumentTitle(doc);

    expect(result).toBe(expand("{Thomas Story's }Early Years & Spiritual Growth"));
  });

  it('does not alter titles shorter than 35 characters', () => {
    friend.name = 'Thomas Story';
    doc.title = "Thomas Story's Journal";

    const result = responsiveDocumentTitle(doc);

    expect(result).toBe(expand("Thomas Story's Journal"));
  });

  it('only removes leading "The " if that gets it under 35 characters', () => {
    friend.name = 'Thomas Story';
    doc.title = 'The LOLOLOLOLOLOLOLOL of Thomas Story';

    const result = responsiveDocumentTitle(doc);

    expect(result).toBe(expand('{The }LOLOLOLOLOLOLOLOL of Thomas Story'));
  });
});
