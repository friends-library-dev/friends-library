// @flow
import get from 'lodash/get';
import type { WebhookPayload } from '../type';
import * as adocPr from './adoc-pr';

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

  if (get(payload, 'repository.name') === 'friends-library') {
    return null;
  }

  if (payload.action === 'closed') {
    return adocPr.handleClose;
  }

  if (!['opened', 'synchronize', 'reopened'].includes(payload.action)) {
    return null;
  }

  return adocPr.handleNewCommit;
}
