import { APIGatewayEvent } from 'aws-lambda';
import { log } from '@friends-library/slack';
import Responder from '../lib/Responder';

export default async function brickOrder(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  try {
    var data = JSON.parse(body || ``);
  } catch (error) {
    log.error(`Unparseable JSON body for /log-error`, { body: body, error });
    return;
  }

  if (!shouldIgnoreError(data)) {
    log.error(`Runtime JS error`, { data });
  }

  respond.noContent();
}

function shouldIgnoreError(data: any): boolean {
  if (typeof data !== `object`) {
    return false;
  }

  if (typeof data.event !== `string` || typeof data.userAgent !== `string`) {
    return false;
  }

  const event: string = data.event;
  const userAgent: string = data.userAgent;

  // can't replicate these google-bot only window.onerror errors
  // seemed to be introduced by a gatsby upgrade, should probably test
  // at some point to see if this ignore rule is necessary with later versions
  return (
    userAgent.includes(`Googlebot`) &&
    event.includes(`The node to be removed is not a child of this node`)
  );
}
