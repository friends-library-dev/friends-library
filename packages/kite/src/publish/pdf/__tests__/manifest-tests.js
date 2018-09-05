import { getPdfManifest } from '../manifest';
import { testJob } from '../../test-helpers';

describe('getPdfManifest()', () => {
  let job;

  beforeEach(() => {
    job = testJob();
    job.target = 'pdf-print';
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
    job = testJob('== C1\n\nPara.\n\n== C2\n\nPara.');
    job.spec.meta.title = 'Anarchy of the Ranters';

    const manifest = getPdfManifest(job);

    expect(manifest['book.css']).toContain('content: "Anarchy of the Ranters";');
  });

  test('css file uses author for title if only one section', () => {
    job = testJob('== Only Section\n\nPara.');
    job.spec.meta.title = 'Anarchy of the Ranters';
    job.spec.meta.author.name = 'Robert Barclay';

    const manifest = getPdfManifest(job);

    expect(manifest['book.css']).toContain('content: "Robert Barclay";');
  });

  test('config short title for running headers preferred, if present', () => {
    job = testJob('== C1\n\nPara.\n\n== C2\n\nPara.');
    job.spec.meta.title = 'Anarchy of the Ranters';
    job.spec.config.shortTitle = 'Anarchy';

    const manifest = getPdfManifest(job);

    expect(manifest['book.css']).toContain('content: "Anarchy";');
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

  test('docs with less than 5 footnotes use symbols', () => {
    job = testJob('== C1\n\nA paragraphfootnote:[_So_ cool!] with some text.');

    const manifest = getPdfManifest(job);

    expect(manifest['book.css']).toContain('counter(footnote, symbols(');
  });

  test('doc with more than 4 footnotes do not use symbols', () => {
    const adoc = '== T\nafootnote:[a]bfootnote:[b]cfootnote:[c]dfootnote:[d]efootnote:[e]';
    job = testJob(adoc);

    const manifest = getPdfManifest(job);

    expect(manifest['book.css']).not.toContain('counter(footnote, symbols(');
  });

  test('custom css is appended', () => {
    job.spec.customCss = {
      'pdf-print': '/* my custom css */',
    };

    const manifest = getPdfManifest(job);

    expect(manifest['book.css']).toContain('/* my custom css */');
  });
});
