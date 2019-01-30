// @flow
import get from 'lodash/get';
import type { WebhookPayload } from '../type';
import { adocPrCommitHandler } from './adoc-pr';

type Handler = (event: string, payload: WebhookPayload) => void | Promise<void>;

export function handle(event: string, payload: WebhookPayload): void {
  const handler = getHandler(event, payload);
  if (handler) {
    handler(event, payload);
  }
}

export function getHandler(event: string, payload: WebhookPayload): ?Handler {
  if (event !== 'pull_request') {
    return null;
  }

  if (!['opened', 'synchronize'].includes(payload.action)) {
    return null;
  }

  if (get(payload, 'repository.name') === 'friends-library') {
    return null;
  }

  return adocPrCommitHandler;
}
