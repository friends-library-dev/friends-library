import { APIGatewayEvent } from 'aws-lambda';
import logDownload from './log-download';
import createOrder from './order-create';
import printJobFees from './print-job-fees';
import submitContactForm from './submit-contact-form';
import brickOrder from './order-brick';
import Responder from '../lib/Responder';
import checkOrders from './orders-check';
import sendOrderConfirmationEmail from './order-send-confirmation-email';
import createPaymentIntent from './payment-intent-create';

export default async function(event: APIGatewayEvent, respond: Responder): Promise<void> {
  const method = event.httpMethod;
  const path = event.path.replace(/^(\/\.netlify\/functions)?\/site\//, ``);

  if (method === `GET`) {
    switch (path) {
      case `wakeup`:
        return respond.noContent();
    }

    if (path.startsWith(`log/download/`)) {
      return logDownload(event, respond);
    }
  }

  if (method === `POST`) {
    switch (path) {
      case `payment-intent`:
        return createPaymentIntent(event, respond);
      case `print-job/fees`:
        return printJobFees(event, respond);
      case `orders/check`:
        return checkOrders(event, respond);
      case `orders`:
        return createOrder(event, respond);
      case `orders/brick`:
        return brickOrder(event, respond);
      case `contact`:
        return submitContactForm(event, respond);
    }

    if (path.match(/^orders\/[a-z0-9-]+\/confirmation-email$/)) {
      return sendOrderConfirmationEmail(event, respond);
    }
  }

  respond.notFound();
}
