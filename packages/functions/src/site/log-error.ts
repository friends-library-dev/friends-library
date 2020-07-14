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

  log.error(`Runtime JS error`, { data });
  respond.noContent();
}
