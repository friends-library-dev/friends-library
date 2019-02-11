// @flow
import type { Context } from '../app';

export default async function kiteCheck(context: Context): Promise<void> {
  const { payload, github, repo } = context;
  await github.checks.create(repo({
    name: 'fl-bot/kite',
    head_sha: payload.pull_request.head.sha,
    status: 'queued',
    started_at: new Date(),
  }));
}
