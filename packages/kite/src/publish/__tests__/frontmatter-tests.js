import { frontmatter } from '../frontmatter';
import { testJob } from '../test-helpers';

describe('frontmatter()', () => {
  let job;

  beforeEach(() => {
    job = testJob();
  });

  it('does not include original title page if no orig title', () => {
    const files = frontmatter(job);

    expect(files['original-title']).toBeUndefined();
  });

  it('includes original title if document has original title', () => {
    job.spec.meta.originalTitle = 'Original title &c.';

    const files = frontmatter(job);

    expect(files['original-title']).toContain('Original title &c.');
  });

  test('copyright has published date if data exists on spec', () => {
    job.spec.meta.published = 1834;

    const files = frontmatter(job);

    expect(files.copyright).toContain('1834');
  });

  test('no originally published item in copyright if no data on spec', () => {
    const files = frontmatter(job);

    expect(files.copyright).not.toContain('Originally published');
  });
});
