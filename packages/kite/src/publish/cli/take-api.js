// @flow
import fetch from 'node-fetch';
import { unstringifyJob } from '../job/utils';
import { take } from './';

const { env: { API_URL } } = process;

export default function takeApi() {
  fetch(`${API_URL || ''}/kite-jobs/take`)
    .then(res => {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return res.json();
      }
      throw new Error('No jobs!');
    })
    .catch(e => console.log(e.message))
    .then(json => unstringifyJob(json.job))
    .then(take)
    .then(console.log);
}
