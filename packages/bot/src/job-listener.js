// @flow
import EventEmitter from 'events';
import fetch from 'node-fetch';

const { env: { BOT_API_URL } } = process;

export default class JobListener extends EventEmitter {

  static POLL_INTERVAL = 10 * 1000; // 10 seconds
  static TIMEOUT = 15 * 60 * 1000;  // 15 minutes

  constructor(ids: Array<Uuid>) {
    super();
    this.ids = ids;
    this.timeouts = {};
    this.jobs = {};
  }

  listen() {
    this.ids.forEach(id => this.fetchState(id));
    this.startTimeout();
  }

  fetchState(id) {
    fetch(`${BOT_API_URL}/kite-jobs/${id}`)
      .then(res => res.json())
      .then(state => this.processUpdate(id, state));
  }

  stateChanged(id, newState) {
    const current = this.jobs[id];
    if (current === null && newState) {
      return true;
    }
    return JSON.stringify(current) !== JSON.stringify(newState);
  }

  processUpdate(id, state) {
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

    const jobs = Object.values(this.jobs);
    if (jobs.every(job => isDone(job.status))) {
      this.clearAllTimeouts();
      this.emit('complete', {
        success: jobs.every(job => job.status === 'succeeded'),
        jobs: this.jobs,
      });
    }
  }

  startTimeout() {
    if (this.timeouts.__timeout__) {
      clearTimeout(this.timeouts.__timeout__);
    }
    this.timeouts.__timeout__ = setTimeout(() => this.onTimeout(), JobListener.TIMEOUT);
  }

  onTimeout() {
    this.emit('timeout');
    this.clearAllTimeouts();
  }

  clearAllTimeouts() {
    Object.values(this.timeouts).forEach(clearTimeout);
  }
}

function isDone(status): boolean {
  return ['succeeded', 'failed'].includes(status);
}
