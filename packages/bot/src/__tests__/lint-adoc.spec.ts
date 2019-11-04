import { getLintAnnotations } from '../lint-adoc';

describe('getLintAnnotations()', () => {
  it('creates github check annotation from lint results', () => {
    const files = [{ path: 'foo.adoc', adoc: "== Chapter 1\n\nAh! '`Tis thou!\n" }];
    const annotations = getLintAnnotations(files, 'en');
    expect(annotations).toHaveLength(1);
    expect(annotations[0]).toMatchObject({
      path: 'foo.adoc',
      start_line: 3,
      end_line: 3,
      start_column: 4,
      end_column: 5,
      annotation_level: 'failure',
      message: 'Incorrect usage of smart quotes/apostrophes',
      raw_details: "Recommended fix:\n\nAh! `'Tis thou!",
    });
  });
});
