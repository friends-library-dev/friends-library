import { APIGatewayEvent } from 'aws-lambda';
import * as slack from '@friends-library/slack';
import { checkoutErrors as Err } from '@friends-library/types';
import mailer from '@sendgrid/mail';
import env from '@friends-library/env';
import Responder from '../lib/Responder';
import log from '../lib/log';
import { findById } from '../lib/Order';
import { orderConfirmationEmail, emailFrom } from '../lib/email';

export default async function sendOrderConfirmationEmail(
  { path }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const pathMatch = path.match(/\/orders\/([a-z0-9]+)\/confirmation-email$/);
  if (!pathMatch) {
    log.error(`invalid send order confirmation email path: ${path}`);
    return respond.json({ msg: Err.INVALID_SEND_ORDER_CONFIRMATION_EMAIL_URL }, 400);
  }

  const [, orderId] = pathMatch;
  const order = await findById(orderId);
  if (!order) {
    return respond.json({ msg: Err.FLP_ORDER_NOT_FOUND }, 404);
  }

  // use this fn invocation to send the successful order slack msg
  // since this is a fire & forget request, the extra slack won't cost here
  slack.sendJson(
    '*Order submitted*',
    {
      order: {
        name: order.get('address.name'),
        email: order.get('email'),
        items: order.get('items'),
        address: order.get('address'),
      },
    },
    env.get('SLACK_ORDERS_CHANNEL').SLACK_ORDERS_CHANNEL,
    ':books:',
  );

  const { SENDGRID_API_KEY } = env.require('SENDGRID_API_KEY');
  mailer.setApiKey(SENDGRID_API_KEY);
  const [res] = await mailer.send({
    ...orderConfirmationEmail(order),
    to: order.get('email'),
    from: emailFrom(order.get('lang')),
    mailSettings: {
      sandboxMode: {
        enable: process.env.NODE_ENV !== 'production',
      },
    },
  });

  if (res.statusCode > 202) {
    return respond.json({ msg: Err.ERROR_SENDING_EMAIL }, 500);
  }

  respond.noContent();
}
