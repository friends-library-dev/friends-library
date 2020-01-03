import fetch from 'node-fetch';
import mailer from '@sendgrid/mail';
import { APIGatewayEvent } from 'aws-lambda';
import { CheckoutError, checkoutErrors as Err } from '@friends-library/types';
import Responder from '../lib/Responder';
import log from '../lib/log';
import mongoose from 'mongoose';
import { find, persistAll } from '../lib/Order';
import { getAuthToken } from '../lib/lulu';
import env from '@friends-library/env';

type Orders = mongoose.Document[];

export default async function checkOrders(
  event: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const orders = await find({ 'print_job.status': 'accepted' });
  if (orders.length === 0) return respond.noContent();

  const [err, jobs] = await getPrintJobs(orders);
  if (err) return respond.json({ msg: err }, 500);

  const updatedOrders = [] as Orders;
  jobs.forEach((job: Record<string, any>) => {
    const status = job.status.name as string;
    if (status === 'IN_PRODUCTION') return;
    const order = orders.find(o => o.get('print_job.id') === job.id);
    if (!order) return;
    switch (status) {
      case 'UNPAID': {
        log.error(`order ${order.id} is unpaid!`);
        break;
      }
      case 'REJECTED':
      case 'CANCELED':
        log.error(`order ${order.id} was ${status}!`);
      case 'SHIPPED': // eslint-disable-line no-fallthrough
        order.set('print_job.status', status.toLowerCase());
        updatedOrders.push(order);
    }
  });

  if (updatedOrders.length) {
    try {
      await persistAll(updatedOrders);
    } catch (error) {
      log.error('error persisting updated orders');
      return respond.json({ msg: Err.ERROR_UPDATING_FLP_ORDERS }, 500);
    }
  }

  await sendShipmentTrackingEmails(jobs, orders);
  respond.noContent();
}

async function getPrintJobs(
  orders: Orders,
): Promise<[null | CheckoutError, Record<string, any>[]]> {
  try {
    var token = await getAuthToken();
  } catch (error) {
    log.error('error acquiring oauth-token', { error });
    return [Err.ERROR_ACQUIRING_LULU_OAUTH_TOKEN, []];
  }

  const { LULU_API_ENDPOINT } = env.require('LULU_API_ENDPOINT');
  const query = orders.map(o => o.get('print_job.id')).join('&id=');
  const res = await fetch(`${LULU_API_ENDPOINT}/print-jobs/?id=${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    log.error('error retrieving print job data', { msg: await res.text() });
    return [Err.ERROR_RETRIEVING_PRINT_JOB_DATA, []];
  }

  const jobs = (await res.json()).results as Record<string, any>[];
  return [null, jobs];
}

async function sendShipmentTrackingEmails(
  jobs: Record<string, any>[],
  orders: Orders,
): Promise<void> {
  const { SENDGRID_API_KEY } = env.require('SENDGRID_API_KEY');
  const shippedJobs = jobs.filter(job => job.status.name === 'SHIPPED');

  const emails = shippedJobs.map(job => {
    const order = orders.find(o => o.get('print_job.id') === job.id);
    if (!order) throw new Error('Matching order not found!');
    // this is a hair naive, theoretically there could be more than one shipment
    // for a huge order, this just gets the first tracking url, but probably good enough
    const trackingUrl = job.line_items[0].tracking_urls[0];
    return {
      to: order.get('email'),
      from: 'app@friendslibrary.com',
      subject: 'Your Friends Library order has shipped!',
      text: `Here is your tracking url: \n${trackingUrl}`,
      mailSettings: { sandboxMode: { enable: process.env.NODE_ENV !== 'production' } },
    };
  });

  try {
    mailer.setApiKey(SENDGRID_API_KEY);
    const sendResult = await mailer.send(emails);
    // typings are bad, sending multiple emails returns multiple responses, like below
    const responses = (sendResult[0] as unknown) as [{ statusCode: number } | undefined];
    const failed = responses.filter(r => r && r.statusCode >= 300);
    if (failed.length) {
      log.error('bad send shipment tracking email response', { error: failed });
    }
  } catch (error) {
    log.error('error sending shipment tracking emails', { error, emails });
  }
}
