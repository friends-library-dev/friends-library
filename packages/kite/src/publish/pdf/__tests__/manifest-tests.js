import { getPdfManifest } from '../manifest';
import { testJob } from '../../test-helpers';

describe('getPdfManifest()', () => {
  let job;

  beforeEach(() => {
    job = testJob();
  });

  it('has css file', () => {
    const manifest = getPdfManifest(job);

    expect(manifest['book.css']).toContain('@page');
  });

  it('html wrapped in full document', () => {
    const manifest = getPdfManifest(job);

    expect(manifest['book.html']).toContain('<!DOCTYPE html>');
  });

  test('css file gets header title dynamically from job', () => {
    job.spec.meta.title = 'Anarchy of the Ranters';

    const manifest = getPdfManifest(job);

    expect(manifest['book.css']).toContain('content: "Anarchy of the Ranters";');
  });

  test('html includes combined sections', () => {
    job = testJob('== C1\n\n== C2');

    const manifest = getPdfManifest(job);

    expect(manifest['book.html']).toContain('C1');
    expect(manifest['book.html']).toContain('C2');
  });

  test('short chapter titles added to section body attr', () => {
    const adoc = '[#intro, short="Intro"]\n== Introduction\n\nPara.';
    job = testJob(adoc);

    const manifest = getPdfManifest(job);

    expect(manifest['book.html']).toContain('sectionbody" short="Intro">');
  });

  test('adds first chapter class to first chapter', () => {
    job = testJob('== C1\n\n== C2');

    const manifest = getPdfManifest(job);

    expect(manifest['book.html']).toContain('<div class="sect1 first-chapter"');
    expect(manifest['book.html']).toContain('<div class="sect1"');
  });

  it('moves footnotes back inline', () => {
    job = testJob('== C1\n\nA paragraphfootnote:[_So_ cool!] with some text.');
    const manifest = getPdfManifest(job);

    const expected = 'A paragraph<span class="footnote"><em>So</em> cool!</span> with';

    expect(manifest['book.html']).toContain(expected);
  });
});
