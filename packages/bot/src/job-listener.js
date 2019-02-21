// @flow
import EventEmitter from 'events';
import fetch from 'node-fetch';
import type { Uuid, Url } from '../../../type';
import { values } from '../../../flow-utils';

const { env: { API_URL } } = process;
if (typeof API_URL !== 'string') {
  throw new Error('API_URL env var must be defined.');
}

type JobState = {|
  status: 'queued' | 'in_progress' | 'failed' | 'succeeded',
  url: ? Url,
|};

export default class JobListener extends EventEmitter {
  static POLL_INTERVAL = 10 * 1000; // 10 seconds
  static TIMEOUT = 15 * 60 * 1000; // 15 minutes

  ids: Array<Uuid>
  timeouts: {[string]: TimeoutID}
  jobs: {[Uuid]: JobState}

  constructor(ids: Array<Uuid>) {
    super();
    this.ids = ids;
    this.timeouts = {};
    this.jobs = {};
  }

  listen(): Promise<*> {
    this.ids.forEach(id => this.fetchState(id));
    this.startTimeout();
    return new Promise(resolve => {
      this.on('shutdown', resolve);
    });
  }

  fetchState(id: Uuid) {
    fetch(`${API_URL}/kite-jobs/${id}`)
      .then(res => res.json())
      .then(json => this.processUpdate(id, {
        status: json.status,
        url: json.url,
      }));
  }

  stateChanged(id: Uuid, newState: JobState) {
    const current = this.jobs[id];
    if (current === null && newState) {
      return true;
    }
    return JSON.stringify(current) !== JSON.stringify(newState);
  }

  processUpdate(id: Uuid, state: JobState) {
    this.emit('update', state);

    if (this.stateChanged(id, state)) {
      this.jobs[id] = state;
      this.startTimeout();
    }

    if (!isDone(state.status)) {
      this.timeouts[id] = setTimeout(
        () => this.fetchState(id),
        JobListener.POLL_INTERVAL,
      );
      return;
    }

    const jobs = values(this.jobs);
    if (jobs.every(job => isDone(job.status))) {
      this.clearAllTimeouts();
      this.emit('complete', {
        success: jobs.every(job => job.status === 'succeeded'),
        jobs: this.jobs,
      });
      this.emit('shutdown');
    }
  }

  startTimeout() {
    if (this.timeouts.timeout) {
      clearTimeout(this.timeouts.timeout);
    }
    this.timeouts.timeout = setTimeout(() => this.onTimeout(), JobListener.TIMEOUT);
  }

  onTimeout() {
    this.emit('timeout');
    this.clearAllTimeouts();
    this.emit('shutdown');
  }

  clearAllTimeouts() {
    values(this.timeouts).forEach(clearTimeout);
  }
}

function isDone(status: string): boolean {
  return ['succeeded', 'failed'].includes(status);
}
