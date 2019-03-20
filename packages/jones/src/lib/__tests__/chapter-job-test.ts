import chapterJob from '../chapter-job';

describe('chapterJob', () => {
  let state;
  let path;

  beforeEach(() => {
    path = 'journal/updated/01.adoc';
    state = {
      repos: [],
      tasks: {
        id: {
          files: {
            'journal/updated/01.adoc': {
              content: '== Ch 1\n',
            },
          },
        },
      },
    };
  });

  it('returns a job, i guess', () => {
    const job = chapterJob(state, 'id', path);
    expect(job.target).toBe('pdf-print');
  });
});
