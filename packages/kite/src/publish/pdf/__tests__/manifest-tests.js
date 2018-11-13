import { getPdfManifest } from '../manifest';
import { testJob } from '../../test-helpers';

describe('getPdfManifest()', () => {
  let job;

  beforeEach(() => {
    job = testJob();
    job.target = 'pdf-web';
  });

  it('has css file', () => {
    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).toContain('@page');
  });

  it('html wrapped in full document', () => {
    const manifest = getPdfManifest(job);

    expect(manifest['doc.html']).toContain('<!DOCTYPE html>');
  });

  test('css file gets header title dynamically from job', () => {
    job = testJob('== C1\n\nPara.\n\n== C2\n\nPara.');
    job.spec.meta.title = 'Anarchy of the Ranters';

    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).toContain('content: "Anarchy of the Ranters";');
  });

  test('css file uses author for title if only one section', () => {
    job = testJob('== Only Section\n\nPara.');
    job.spec.meta.title = 'Anarchy of the Ranters';
    job.spec.meta.author.name = 'Robert Barclay';

    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).toContain('content: "Robert Barclay";');
  });

  test('config short title for running headers preferred, if present', () => {
    job = testJob('== C1\n\nPara.\n\n== C2\n\nPara.');
    job.spec.meta.title = 'Anarchy of the Ranters';
    job.spec.config.shortTitle = 'Anarchy';

    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).toContain('content: "Anarchy";');
  });

  test('html includes combined sections', () => {
    job = testJob('== C1\n\n== C2');

    const manifest = getPdfManifest(job);

    expect(manifest['doc.html']).toContain('C1');
    expect(manifest['doc.html']).toContain('C2');
  });

  test('short chapter titles added to section body attr', () => {
    const adoc = '[#intro, short="Intro"]\n== Introduction\n\nPara.';
    job = testJob(adoc);

    const manifest = getPdfManifest(job);

    expect(manifest['doc.html']).toContain('sectionbody" short="Intro">');
  });

  test('adds first chapter class to first chapter', () => {
    job = testJob('== C1\n\n== C2');

    const manifest = getPdfManifest(job);

    expect(manifest['doc.html']).toContain('<div class="sect1 first-chapter');
    expect(manifest['doc.html']).toContain('<div class="sect1 chapter--no-signed-section"');
  });

  it('moves footnotes back inline', () => {
    job = testJob('== C1\n\nA paragraphfootnote:[_So_ cool!] with some text.');
    const manifest = getPdfManifest(job);

    const expected = 'A paragraph<span class="footnote"><em>So</em> cool!</span> with';

    expect(manifest['doc.html']).toContain(expected);
  });

  test('docs with less than 5 footnotes use symbols', () => {
    job = testJob('== C1\n\nA paragraphfootnote:[_So_ cool!] with some text.');

    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).toContain('counter(footnote, symbols(');
  });

  test('doc with more than 4 footnotes do not use symbols', () => {
    const adoc = '== T\nafootnote:[a]bfootnote:[b]cfootnote:[c]dfootnote:[d]efootnote:[e]';
    job = testJob(adoc);

    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).not.toContain('counter(footnote, symbols(');
  });

  test('custom css is appended', () => {
    job.spec.customCss = {
      'pdf-web': '/* my custom css */',
    };

    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).toContain('/* my custom css */');
  });

  test('book trim size added to body class', () => {
    job.target = 'pdf-print';
    job.cmd.printSize = 'xl';

    const manifest = getPdfManifest(job);

    expect(manifest['doc.html']).toContain('<body class="body trim--xl">');
  });

  test('frontmatter omitted if specified in command', () => {
    job.cmd.frontmatter = false;

    const manifest = getPdfManifest(job);

    expect(manifest['doc.html']).not.toContain('half-title-page');
  });

  test('contains original title if present', () => {
    job.spec.meta.originalTitle = 'Ye Olde Title, &c.';

    const manifest = getPdfManifest(job);

    expect(manifest['doc.html']).toContain('Ye Olde Title, &c.');
    expect(manifest['doc.html']).toContain('original-title-page');
  });
});
