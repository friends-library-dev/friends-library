import { Job } from '@friends-library/types';
import { getPdfManifest } from '../manifest';
import { testJob } from '../../test-helpers';

describe('getPdfManifest()', () => {
  let job: Job;

  beforeEach(() => {
    job = testJob();
    job.target = 'pdf-web';
  });

  it('has css file', () => {
    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).toContain('@page');
  });

  test('css file gets header title dynamically from job', () => {
    job = testJob('== C1\n\nPara.\n\n== C2\n\nPara.');
    // @ts-ignore
    job.spec.meta.title = 'Anarchy of the Ranters';

    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).toContain('content: "Anarchy of the Ranters";');
  });

  test('css file uses author for title if only one section', () => {
    job = testJob('== Only Section\n\nPara.');
    // @ts-ignore
    job.spec.meta.title = 'Anarchy of the Ranters';
    job.spec.meta.author.name = 'Robert Barclay';

    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).toContain('content: "Robert Barclay";');
  });

  test('config short title for running headers preferred, if present', () => {
    job = testJob('== C1\n\nPara.\n\n== C2\n\nPara.');
    // @ts-ignore
    job.spec.meta.title = 'Anarchy of the Ranters';
    job.spec.config.shortTitle = 'Anarchy';

    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).toContain('content: "Anarchy";');
  });

  test('short chapter titles added to section body attr', () => {
    const adoc = '[#intro, short="Intro"]\n== Introduction\n\nPara.';
    job = testJob(adoc);

    const manifest = getPdfManifest(job);

    expect(manifest['doc.html']).toContain('sectionbody" short="Intro">');
  });

  test('docs with less than 5 footnotes use symbols', () => {
    job = testJob('== C1\n\nA paragraphfootnote:[_So_ cool!] with some text.');

    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).toContain('counter(footnote, symbols(');
  });

  test('doc with more than 4 footnotes do not use symbols', () => {
    const adoc =
      '== T\n\nafootnote:[a]bfootnote:[b]cfootnote:[c]dfootnote:[d]efootnote:[e]';
    const myJob = testJob(adoc);

    const manifest = getPdfManifest(myJob);

    expect(manifest['doc.css']).not.toContain('counter(footnote, symbols(');
  });

  test('custom css is appended', () => {
    // @ts-ignore
    job.spec.customCss = {
      'pdf-web': '/* my custom css */',
    };

    const manifest = getPdfManifest(job);

    expect(manifest['doc.css']).toContain('/* my custom css */');
  });

  test('book trim size added to body class', () => {
    job.target = 'pdf-print';
    // @ts-ignore
    job.meta.printSize = 'xl';

    const manifest = getPdfManifest(job);

    expect(manifest['doc.html']).toContain('<body class="body trim--xl">');
  });

  test('frontmatter omitted if specified in command', () => {
    // @ts-ignore
    job.meta.frontmatter = false;

    const manifest = getPdfManifest(job);

    expect(manifest['doc.html']).not.toContain('half-title-page');
  });

  test('contains original title if present', () => {
    // @ts-ignore
    job.spec.meta.originalTitle = 'Ye Olde Title, &c.';

    const manifest = getPdfManifest(job);

    expect(manifest['doc.html']).toContain('Ye Olde Title, &c.');
    expect(manifest['doc.html']).toContain('original-title-page');
  });
});
