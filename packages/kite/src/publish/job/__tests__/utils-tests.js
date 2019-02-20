import { stringifyJob, unstringifyJob } from '../utils';
import { createPrecursor, createSpec, createJob } from '..';

jest.mock('uuid/v4', () => {
  return jest.fn(() => 'uuid');
});

describe('stringifyJob()', () => {
  it('can handle stringifying note maps', () => {
    const adoc = '== Ch 1\n\nFoo.footnote:[bar]';
    const precursor = createPrecursor({ adoc });
    const job = createJob({ spec: createSpec(precursor) });
    const json = stringifyJob(job);
    const parsed = JSON.parse(json);

    expect(parsed.spec.notes).toEqual([['uuid', 'bar']]);
  });

  it('stringifies empty notes to empty array', () => {
    const adoc = '== Ch 1';
    const precursor = createPrecursor({ adoc });
    const job = createJob({ spec: createSpec(precursor) });
    const json = stringifyJob(job);
    const parsed = JSON.parse(json);

    expect(parsed.spec.notes).toEqual([]);
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
