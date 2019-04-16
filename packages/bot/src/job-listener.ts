import EventEmitter from 'events';
import fetch from 'node-fetch';
import { Uuid, Url } from '@friends-library/types';

const {
  env: { API_URL },
} = process;

if (typeof API_URL !== 'string') {
  throw new Error('API_URL env var must be defined.');
}

type JobState = {
  status: 'queued' | 'in_progress' | 'failed' | 'succeeded';
  url?: Url;
};

export default class JobListener extends EventEmitter {
  static POLL_INTERVAL = 10 * 1000; // 10 seconds
  static TIMEOUT = 15 * 60 * 1000; // 15 minutes
  static KEEP_ALIVE_INTERVAL = 60 * 1000; // 1 minute

  ids: Uuid[];
  timeouts: { [k: string]: any };
  jobs: { [k: string]: JobState };

  constructor(ids: Uuid[]) {
    super();
    this.ids = ids;
    this.timeouts = {};
    this.jobs = {};
  }

  public listen(): Promise<void> {
    this.ids.forEach(id => this.fetchState(id));
    this.startTimeout();
    this.keepAlive();
    return new Promise(resolve => {
      this.on('shutdown', resolve);
    });
  }

  protected fetchState(id: Uuid) {
    fetch(`${API_URL}/kite-jobs/${id}`)
      .then(res => res.json())
      .then(json =>
        this.processUpdate(id, {
          status: json.status,
          url: json.url,
        }),
      );
  }

  protected stateChanged(id: Uuid, newState: JobState) {
    const current = this.jobs[id];
    if (current === null && newState) {
      return true;
    }
    return JSON.stringify(current) !== JSON.stringify(newState);
  }

  protected processUpdate(id: Uuid, state: JobState) {
    this.emit('update', { id, ...state });

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

    const jobs = Object.values(this.jobs);
    if (jobs.every(job => isDone(job.status))) {
      this.clearAllTimeouts();
      this.emit('complete', {
        success: jobs.every(job => job.status === 'succeeded'),
        jobs: this.jobs,
      });
      this.emit('shutdown', this.jobs);
    }
  }

  protected keepAlive() {
    if (this.timeouts.keepAlive) {
      clearTimeout(this.timeouts.keepAlive);
    }
    this.timeouts.keepAlive = setTimeout(() => {
      fetch(`${API_URL}/kite-jobs?filter=working`)
        .then(res => res.json())
        .then(json => {
          this.keepAlive();
          if (json.length > 0) {
            this.startTimeout();
          }
        });
    }, JobListener.KEEP_ALIVE_INTERVAL);
  }

  protected startTimeout() {
    if (this.timeouts.timeout) {
      clearTimeout(this.timeouts.timeout);
    }
    this.timeouts.timeout = setTimeout(() => this.onTimeout(), JobListener.TIMEOUT);
  }

  protected onTimeout() {
    this.emit('timeout');
    this.clearAllTimeouts();
    this.emit('shutdown', this.jobs);
  }

  protected clearAllTimeouts() {
    Object.values(this.timeouts).forEach(clearTimeout);
  }
}

function isDone(status: string): boolean {
  return ['succeeded', 'failed'].includes(status);
}
