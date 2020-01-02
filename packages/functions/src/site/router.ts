import { APIGatewayEvent } from 'aws-lambda';
import webDownload from './web-download';
import createOrder from './order-create';
import capturePayment from './payment-capture';
import authorizePayment from './payment-authorize';
import printJobFees from './print-job-fees';
import createPrintJob from './print-job-create';
import printJobStatus from './print-job-status';
import fetchOrder from './order-fetch';
import updateOrder from './order-update';
import brickOrder from './order-brick';
import Responder from '../lib/Responder';
import checkOrders from './orders-check';
import sendOrderConfirmationEmail from './order-send-confirmation-email';

export default async function(event: APIGatewayEvent, respond: Responder): Promise<void> {
  const method = event.httpMethod;
  const path = event.path.replace(/^(\/\.netlify\/functions)?\/site\//, '');
  if (method === 'GET') {
    switch (path) {
      case 'wakeup':
        return respond.noContent();
    }

    if (path.startsWith('orders/')) {
      return fetchOrder(event, respond);
    }

    if (path.match(/^print-job\/\d+\/status$/)) {
      return printJobStatus(event, respond);
    }

    if (path.startsWith('download/web/')) {
      return webDownload(event, respond);
    }
  }

  if (method === 'POST') {
    switch (path) {
      case 'payment/capture':
        return capturePayment(event, respond);
      case 'payment/authorize':
        return authorizePayment(event, respond);
      case 'print-job/fees':
        return printJobFees(event, respond);
      case 'print-job':
        return createPrintJob(event, respond);
      case 'orders/check':
        return checkOrders(event, respond);
      case 'orders/create':
        return createOrder(event, respond);
      case 'orders/brick':
        return brickOrder(event, respond);
    }
    if (path.match(/^orders\/[a-z0-9]+\/confirmation-email$/)) {
      return sendOrderConfirmationEmail(event, respond);
    }
  }

  if (method === 'PATCH') {
    if (path.match(/^orders\/[a-z0-9]+$/)) {
      return updateOrder(event, respond);
    }
  }

  respond.notFound();
}
