import { APIGatewayEvent } from 'aws-lambda';
import mailer from '@sendgrid/mail';
import stripIndent from 'strip-indent';
import { requireEnv } from '@friends-library/types';
import Responder from '../lib/Responder';
import log from '../lib/log';
import { findById } from '../lib/Order';

export default async function sendOrderConfirmationEmail(
  { path }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const pathMatch = path.match(/\/orders\/([a-z0-9]+)\/confirmation-email$/);
  if (!pathMatch) {
    log.error(`invalid send order confirmation email path: ${path}`);
    return respond.json({ msg: 'invalid_path' }, 400);
  }

  const [, orderId] = pathMatch;
  const order = await findById(orderId);
  if (!order) {
    return respond.json({ msg: 'order_not_found' }, 404);
  }

  const { SENDGRID_API_KEY, NODE_ENV } = requireEnv('SENDGRID_API_KEY', 'NODE_ENV');
  mailer.setApiKey(SENDGRID_API_KEY);
  const [res] = await mailer.send({
    to: order.get('email'),
    from: 'app@friendslibrary.com',
    subject: `[,] -- Order: ${orderId}`,
    text: emailText(order.id),
    mailSettings: {
      sandboxMode: {
        enable: NODE_ENV !== 'production',
      },
    },
  });

  if (res.statusCode > 202) {
    return respond.json({ msg: 'error_sending_email' }, 500);
  }

  respond.noContent();
}

function emailText(orderId: string): string {
  return stripIndent(`
    Thanks for ordering from Friends Library Publishing!

    For your reference, your order id is

    ${orderId}

    We'll be sending you one more email in a few days with your tracking number, as soon as it ships.

    Please don't hesitate to let us know if you have any questions!

    - Friends Library Publishing`);
}
