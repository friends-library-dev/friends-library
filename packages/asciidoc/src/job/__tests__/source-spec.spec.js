import omit from 'lodash/omit';
import { createPrecursor } from '../';
import createSourceSpec from '../source-spec';

describe('createSourceSpec()', () => {
  it('passes through all simple props from precursor', () => {
    const opts = {
      id: 'my-id',
      adoc: '== Ch1',
      lang: 'es',
      meta: { title: 'My Title' },
      filename: 'Foo',
      revision: {
        timestamp: 123,
        sha: '123abc',
        url: '/url',
      },
      config: { foo: 'bar' },
      customCss: { all: 'custom' },
    };
    const precursor = createPrecursor(opts);
    const spec = createSourceSpec(precursor);
    expect(spec).toMatchObject(omit(opts, 'adoc'));
  });
});
