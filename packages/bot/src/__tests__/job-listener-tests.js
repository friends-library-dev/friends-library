import fetch from 'node-fetch';
import JobListener from '../job-listener';

jest.mock('node-fetch');
jest.useFakeTimers();


describe('JobListener', () => {
  it('polls status endpoint and emits `update` events', () => {
    mockJobStatus({
      'job-id-1': [
        { status: 'queued' },
        { status: 'in_progress' },
        { status: 'completed' },
      ],
    });

    const listener = new JobListener(['job-id-1']);

    const updateSpy = jest.fn();
    listener.on('update', updateSpy);
    expect(updateSpy).not.toHaveBeenCalled();

    listener.listen();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy.mock.calls[0][0]).toMatchObject({ status: 'queued' });

    jest.advanceTimersByTime(JobListener.POLL_INTERVAL);
    expect(updateSpy).toHaveBeenCalledTimes(2);
    expect(updateSpy.mock.calls[1][0]).toMatchObject({ status: 'in_progress' });

    jest.advanceTimersByTime(JobListener.POLL_INTERVAL);
    expect(updateSpy).toHaveBeenCalledTimes(3);
    expect(updateSpy.mock.calls[2][0]).toMatchObject({ status: 'completed' });
  });

  it('emits complete event when all jobs succeed', () => {
    mockJobStatus({
      'job-id-1': [
        { status: 'queued' },
        { status: 'succeeded', url: '/uploaded.pdf' },
      ],
    });

    const listener = new JobListener(['job-id-1']);
    const completeSpy = jest.fn();
    listener.on('complete', completeSpy);
    listener.listen();

    expect(completeSpy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(JobListener.POLL_INTERVAL);

    expect(completeSpy).toHaveBeenCalledWith({
      success: true,
      jobs: {
        'job-id-1': { status: 'succeeded', url: '/uploaded.pdf' },
      },
    });
  });

  it('emits complete event when all jobs succeed or fail', () => {
    mockJobStatus({
      'job-id-1': [
        { status: 'queued' },
        { status: 'succeeded', url: '/uploaded.pdf' },
      ],
      'job-id-2': [
        { status: 'queued' },
        { status: 'failed' },
      ],
    });

    const listener = new JobListener(['job-id-1', 'job-id-2']);
    const completeSpy = jest.fn();
    listener.on('complete', completeSpy);
    listener.listen();
    jest.advanceTimersByTime(JobListener.POLL_INTERVAL);

    expect(completeSpy).toHaveBeenCalledWith({
      success: false,
      jobs: {
        'job-id-1': { status: 'succeeded', url: '/uploaded.pdf' },
        'job-id-2': { status: 'failed' },
      },
    });
  });

  it('emits `timeout` after waiting too long for unresolved job result', () => {
    mockJobStatus({
      'job-id-1': [
        { status: 'queued' }, // will repeat forever
      ],
    });

    const listener = new JobListener(['job-id-1']);
    const timeoutSpy = jest.fn();
    listener.on('timeout', timeoutSpy);
    listener.listen();

    jest.advanceTimersByTime(JobListener.TIMEOUT - 1);
    expect(timeoutSpy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(timeoutSpy).toHaveBeenCalled();
  });

  test('receiving new data from API re-starts global timeout', () => {
    mockJobStatus({
      'job-id-1': [
        { status: 'queued' },
        { status: 'in_progress' },
        { status: 'awaiting_retry' },
        { status: 'in_progress' }, // last one keeps repeating
      ],
    });

    const listener = new JobListener(['job-id-1']);
    const timeoutSpy = jest.fn();
    listener.on('timeout', timeoutSpy);
    listener.listen();

    // multiply POLL_INTERVAL by 3 to represent RE-STARTING the
    // global timeout whenever we get novel data from the API
    const advance = JobListener.TIMEOUT + (JobListener.POLL_INTERVAL * 3) - 1;

    jest.advanceTimersByTime(advance);
    expect(timeoutSpy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(timeoutSpy).toHaveBeenCalled();
  });
});

function mockJobStatus(map) {
  fetch.mockImplementation(url => {
    const jobId = url.split('/').pop();
    if (!map[jobId]) {
      throw new Error(`Unknown job id: ${jobId}`);
    }

    return {
      then() {
        return {
          then(fn) {
            fn(map[jobId].length > 1 ? map[jobId].shift() : map[jobId][0]);
          },
        };
      },
    };
  });
}
