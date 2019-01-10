import { searchFiles } from '../search';

describe('searchFiles()', () => {
  let files;

  beforeEach(() => {
    files = [{
      filename: '01.adoc',
      path: 'en/george-fox/journal/updated/01.adoc',
      editedContent: '== Chapter 1\n\nRofl. Foo.\nBar.',
    }];
  });

  it('should work!', () => {
    const [result] = searchFiles('foo', files);
    expect(result.line).toBe(3);
  });
});
