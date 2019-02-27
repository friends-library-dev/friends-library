import { getLintAnnotations } from '../lint-adoc';

describe('getLintAnnotations()', () => {
  it('creates github check annotation from lint results', () => {
    const files = [{ path: 'foo.adoc', adoc: "Ah! '`Tis thou!\n" }];
    const annotations = getLintAnnotations(files);
    expect(annotations).toHaveLength(1);
    expect(annotations[0]).toMatchObject({
      path: 'foo.adoc',
      start_line: 1,
      end_line: 1,
      start_column: 4,
      end_column: 5,
      annotation_level: 'failure',
      message: 'Incorrect usage of smart quotes/apostrophes',
      raw_details: "Recommended fix:\n\nAh! `'Tis thou!",
    });
  });
});
