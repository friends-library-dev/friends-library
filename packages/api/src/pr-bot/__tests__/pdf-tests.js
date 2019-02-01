import { friendFromJS } from '@friends-library/friends';
import { createJobs } from '../pdf';

describe('pdf()', () => {
  let friend;
  let modifiedFiles;
  let prFiles;
  let sha;

  beforeEach(() => {
    sha = '2d306bb70578e6c019e3579c02d4f78f17bf915e';
    prFiles = new Map([
      ['journal/updated/01.adoc', '== Ch 1'],
      ['journal/updated/02.adoc', '== Ch 2'],
    ]);
    modifiedFiles = ['journal/updated/01.adoc'];
    friend = friendFromJS({
      documents: [
        {
          slug: 'journal',
          editions: [
            {
              type: 'updated',
            },
          ],
        },
      ],
    });
  });

  test('orders out-of-order PR files', () => {
    prFiles = new Map([
      ['journal/updated/02.adoc', '== Ch 2'],
      ['journal/updated/01.adoc', '== Ch 1'],
    ]);
    const [job] = createJobs(friend, modifiedFiles, prFiles, sha);
    expect(job.spec.sections[0].heading.text).toBe('Ch 1');
    expect(job.spec.sections[1].heading.text).toBe('Ch 2');
  });

  test('does not make chapter files when flag is false', () => {
    const jobs = createJobs(friend, modifiedFiles, prFiles, sha, false);
    expect(jobs).toHaveLength(1);
    expect(jobs[0].filename).toBe('2d306bb--journal--updated.pdf');
  });

  test('two jobs created for one modified file (file & edition)', () => {
    const jobs = createJobs(friend, modifiedFiles, prFiles, sha, true);
    expect(jobs).toHaveLength(2);
    expect(jobs[0].filename).toBe('2d306bb--journal--updated--01.pdf');
    expect(jobs[1].filename).toBe('2d306bb--journal--updated.pdf');
  });

  test('job has correct properties', () => {
    const [chapter, edition] = createJobs(friend, modifiedFiles, prFiles, sha, true);

    expect(chapter.target).toBe('pdf-print');
    expect(edition.target).toBe('pdf-print');
    expect(chapter.cmd.frontmatter).toBe(false);
    expect(edition.cmd.frontmatter).toBe(true);
  });

  test('job spec property is correctly formed', () => {
    const [chapter, edition] = createJobs(friend, modifiedFiles, prFiles, sha, true);

    const shape = {
      lang: 'en',
      customCss: {},
      config: {},
    };

    expect(chapter.spec).toMatchObject(shape);
    expect(edition.spec).toMatchObject(shape);
    expect(chapter.spec.filename).toBe('2d306bb--journal--updated--01');
    expect(edition.spec.filename).toBe('2d306bb--journal--updated');
    expect(chapter.spec.sections.length).toBe(1);
    expect(edition.spec.sections.length).toBe(2);
  });
});
