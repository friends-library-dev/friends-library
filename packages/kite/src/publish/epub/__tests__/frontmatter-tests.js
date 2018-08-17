import { frontmatter } from '../frontmatter';
import { testJob } from '../../test-helpers';

describe('frontmatter()', () => {
  let job;

  beforeEach(() => {
    job = testJob();
  });

  it('does not add footnote-helper if no notes', () => {
    job = testJob('== Chapter 1');

    const fm = frontmatter(job);

    expect(fm['footnote-helper']).toBeUndefined();
  });

  it('adds footnote-helper if doc has notes', () => {
    job = testJob('== C1\n\nPara.footnote:[Foo.]');

    const fm = frontmatter(job);

    expect(fm['footnote-helper']).toContain('footnote-helper');
  });

  test('epub has no content-toc', () => {
    job.target = 'epub';

    const fm = frontmatter(job);

    expect(fm['content-toc']).toBeUndefined();
  });

  test('mobi has content-toc in correct position', () => {
    job.target = 'mobi';

    const fm = frontmatter(job);

    expect(fm['content-toc']).toContain('content-toc');
    expect(Object.keys(fm)[3]).toBe('content-toc');
  });
});
