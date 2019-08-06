import { APIGatewayEvent } from 'aws-lambda';
import webDownload from './web-download';
import authorizePayment from './payment-authorize';
import capturePayment from './payment-capture';
import calculatePrintOrderFees from './print-calculate-fees';
import createPrintOrder from './print-create-order';
import printOrderStatus from './print-order-status';
import Responder from '../lib/Responder';

export default async function(event: APIGatewayEvent, respond: Responder): Promise<void> {
  const method = event.httpMethod;
  const path = event.path.replace(/^(\/\.netlify\/functions)?\/site\//, '');

  if (method === 'GET') {
    switch (path) {
      case 'wakeup':
        return respond.noContent();
    }

    if (path.startsWith('print/order-status/')) {
      return printOrderStatus(event, respond);
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
      case 'print/calculate-fees':
        return calculatePrintOrderFees(event, respond);
      case 'print/create-order':
        return createPrintOrder(event, respond);
    }
  }

  respond.notFound();
}
