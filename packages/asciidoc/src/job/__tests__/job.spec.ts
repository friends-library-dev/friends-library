import { createPrecursor, createJob } from '..';
import { SourcePrecursor } from '@friends-library/types';

jest.mock('uuid/v4', () => {
  return jest.fn(() => 'UUID');
});

describe('createJob()', () => {
  it('returns a valid job with no data passed', () => {
    const job = createJob();
    expect(job).toMatchObject({
      id: 'UUID',
      filename: 'document--(print).pdf',
      target: 'pdf-print',
      meta: {
        check: false,
        perform: false,
        condense: false,
        frontmatter: true,
        createEbookCover: false,
      },
    });
  });

  it('allows overriding of top-level props', () => {
    const data = {
      id: 'foo',
      filename: 'foo.epub',
      target: 'epub',
      spec: 'my-spec',
    };
    const job = createJob(data);
    expect(job).toMatchObject(data);
  });

  it('allows white-listed overriding of job meta', () => {
    const meta = {
      check: true,
      perform: true,
      condense: true,
      frontmatter: false,
      createEbookCover: true,
    };
    const job = createJob({ meta: { ...meta, nope: 'bad' } });
    expect(job.meta).toEqual(meta);
  });
});

describe('createPrecursor()', () => {
  it('returns a valid precursor with no data passed', () => {
    const precursor = createPrecursor();
    expect(precursor).toMatchObject({
      id: 'UUID',
      config: {},
      customCss: {},
      lang: 'en',
      filename: 'document',
      adoc: '',
      revision: {
        sha: '<UNKNOWN>',
        url: '#',
      },
      meta: {
        title: 'Unknown Document',
        author: {
          name: 'Unknown Author',
          nameSort: 'Author, Unknown',
        },
      },
    });
  });

  it('allows overriding top level props', () => {
    const data: { [k in keyof SourcePrecursor]?: any } = {
      id: 'foo',
      config: 'myconfig',
      customCss: 'myCss',
      filename: 'myFilename',
      lang: 'es',
      adoc: '== Ch 1',
    };
    const precursor = createPrecursor(data);
    Object.entries(data).forEach(([key, value]) => {
      // @ts-ignore
      expect(precursor[key]).toBe(value);
    });
  });

  it('allows overriding revision sub-object', () => {
    const revision = {
      timestamp: 'now',
      sha: 'foobar',
      url: 'google',
    };
    const precursor = createPrecursor({ revision });
    expect(precursor.revision).toEqual(revision);
  });

  it('allows overriding meta sub-object', () => {
    const meta = {
      title: 'my title',
      isbn: '123-4',
      originalTitle: 'Olde Title',
      published: 1655,
      editor: 'Jared Henderson',
      author: {
        name: 'George Fox',
        nameSort: 'Fox, George',
      },
    };
    const precursor = createPrecursor({ meta });
    expect(precursor.meta).toEqual(meta);
  });
});
