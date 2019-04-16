import { createPrecursor, createSourceSpec, createJob } from '@friends-library/asciidoc';
import { jobToJson, unstringifyJob } from '../utils';

jest.mock('uuid/v4', () => {
  return jest.fn(() => 'uuid');
});

describe('jobToJson()', () => {
  it('turns note maps into array for stringification', () => {
    const adoc = '== Ch 1\n\nFoo.footnote:[bar]';
    const precursor = createPrecursor({ adoc });
    const job = createJob({ spec: createSourceSpec(precursor) });
    const json = jobToJson(job);

    expect(json.spec.notes).toEqual([['uuid', 'bar']]);
  });

  it('turns empty notes into empty array', () => {
    const adoc = '== Ch 1';
    const precursor = createPrecursor({ adoc });
    const job = createJob({ spec: createSourceSpec(precursor) });
    const json = jobToJson(job);

    expect(json.spec.notes).toEqual([]);
  });
});

describe('unstringifyJob', () => {
  it('converts notes back to maps', () => {
    const str = JSON.stringify({
      spec: {
        notes: [['uuid', 'bar']],
      },
    });

    const job = unstringifyJob(str);

    expect(job.spec.notes).toEqual(new Map([['uuid', 'bar']]));
  });

  it('converts empty notes back to empty Map', () => {
    const str = JSON.stringify({
      spec: {
        notes: [],
      },
    });

    const job = unstringifyJob(str);

    expect(job.spec.notes).toEqual(new Map());
  });
});
