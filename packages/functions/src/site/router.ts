import { APIGatewayEvent } from 'aws-lambda';
import webDownload from './web-download';
import authorizePayment from './payment-authorize';
import capturePayment from './payment-capture';
import printJobFees from './print-job-fees';
import createPrintJob from './print-job-create';
import printJobStatus from './print-job-status';
import fetchOrder from './order-fetch';
import updateOrder from './order-update';
import Responder from '../lib/Responder';

export default async function(event: APIGatewayEvent, respond: Responder): Promise<void> {
  const method = event.httpMethod;
  const path = event.path.replace(/^(\/\.netlify\/functions)?\/site\//, '');
  if (method === 'GET') {
    switch (path) {
      case 'wakeup':
        return respond.noContent();
    }

    if (path.startsWith('order/')) {
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
      case 'payment/authorize':
        return authorizePayment(event, respond);
      case 'payment/capture':
        return capturePayment(event, respond);
      case 'print-job/fees':
        return printJobFees(event, respond);
      case 'print-job':
        return createPrintJob(event, respond);
    }
  }

  if (method === 'PATCH') {
    if (path.match(/^order\/[a-z0-9]+$/)) {
      return updateOrder(event, respond);
    }
  }

  respond.notFound();
}
