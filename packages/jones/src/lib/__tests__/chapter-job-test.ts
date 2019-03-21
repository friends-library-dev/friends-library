import chapterJob from '../chapter-job';

describe('chapterJob', () => {
  let state;
  let path;

  beforeEach(() => {
    path = 'journal/updated/01.adoc';
    state = {
      repos: [],
      tasks: {
        present: {
          id: {
            repoId: 1,
            files: {
              'journal/updated/01.adoc': {
                content: '== Ch 1\n\n_Foo_.\n',
              },
            },
          },
        },
      },
    };
  });

  it('returns a job with html from the asciidoc', () => {
    const job = chapterJob(state, 'id', path);
    expect(job.target).toBe('pdf-print');
    expect(job.spec.sections[0].html).toContain('<em>Foo</em>');
  });
});
