import fetch from 'node-fetch';
import mailer from '@sendgrid/mail';
import { APIGatewayEvent } from 'aws-lambda';
import { CheckoutError, checkoutErrors as Err } from '@friends-library/types';
import env from '../lib/env';
import Responder from '../lib/Responder';
import log from '../lib/log';
import { findByPrintJobStatus, saveAll, Order } from '../lib/order';
import { getAuthToken } from '../lib/lulu';
import { orderShippedEmail, emailFrom } from '../lib/email';

export default async function checkOrders(
  event: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const [error, orders] = await findByPrintJobStatus('accepted');
  if (error || !orders) {
    log.error(`Error retrieving orders for /orders/check`, { error, orders });
    return respond.json({ msg: Err.ERROR_RETRIEVING_FLP_ORDERS }, 500);
  }

  if (orders.length === 0) {
    log.info('No accepted print jobs to process');
    return respond.json({ msg: 'No accepted print jobs to process' });
  }

  const [printJobErr, jobs] = await getPrintJobs(orders);
  if (printJobErr) {
    log.error('Error fetching print jobs from lulu api', { error: printJobErr });
    return respond.json({ msg: printJobErr }, 500);
  }

  const updatedOrders: Order[] = [];
  const recentlyShippedOrders: Order[] = [];

  jobs.forEach((job: Record<string, any>) => {
    const status = job.status.name as string;
    if (status === 'IN_PRODUCTION') {
      return;
    }

    const order = orders.find(o => o.printJobId === job.id);
    if (!order) {
      return;
    }

    switch (status) {
      case 'UNPAID': {
        log.error(`order ${order.id} is unpaid!`);
        break;
      }

      case 'REJECTED':
      case 'CANCELLED':
      case 'CANCELED':
        log.error(`order ${order.id} was ${status}!`);
        order.printJobStatus = status === 'REJECTED' ? 'rejected' : 'canceled';
        updatedOrders.push(order);
        break;

      case 'SHIPPED':
        log.order(`Order ${order.id} shipped`);
        order.printJobStatus = 'shipped';
        updatedOrders.push(order);
        recentlyShippedOrders.push(order);
    }
  });

  if (updatedOrders.length) {
    const [error] = await saveAll(updatedOrders);
    if (error) {
      log.error('error persisting updated orders', { error });
      return respond.json({ msg: Err.ERROR_UPDATING_FLP_ORDERS, error }, 500);
    }
  }

  if (recentlyShippedOrders.length) {
    await sendShipmentTrackingEmails(jobs, recentlyShippedOrders);
  }

  log.info(
    `Updated ${updatedOrders.length} orders, and sent ${recentlyShippedOrders.length} tracking emails`,
  );

  respond.json({
    num_updated_orders: updatedOrders.length,
    num_tracking_emails_sent: recentlyShippedOrders.length,
  });
}

async function getPrintJobs(
  orders: Order[],
): Promise<[null | CheckoutError, Record<string, any>[]]> {
  try {
    var token = await getAuthToken();
  } catch (error) {
    log.error('error acquiring oauth-token', { error });
    return [Err.ERROR_ACQUIRING_LULU_OAUTH_TOKEN, []];
  }

  const query = orders.map(o => o.printJobId).join('&id=');
  const res = await fetch(`${env('LULU_API_ENDPOINT')}/print-jobs/?id=${query}`, {
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
  orders: Order[],
): Promise<void> {
  const shippedJobs = jobs.filter(job => job.status.name === 'SHIPPED');

  const emails = shippedJobs.map(job => {
    const order = orders.find(o => o.printJobId === job.id);
    if (!order) throw new Error('Matching order not found!');
    // this is a hair naive, theoretically there could be more than one shipment
    // for a huge order, this just gets the first tracking url, but probably good enough
    const trackingUrl = job.line_items[0].tracking_urls[0];
    return {
      ...orderShippedEmail(order, trackingUrl),
      to: order.email,
      from: emailFrom(order.lang),
      mailSettings: { sandboxMode: { enable: process.env.NODE_ENV === 'development' } },
    };
  });

  try {
    mailer.setApiKey(env('SENDGRID_API_KEY'));
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
