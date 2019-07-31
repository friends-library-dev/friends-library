import { APIGatewayEvent } from 'aws-lambda';
import webDownload from './web-download';
import authorizePayment from './payment-authorize';
import capturePayment from './payment-capture';
import Responder from '../lib/Responder';

export default async function(event: APIGatewayEvent, respond: Responder): Promise<void> {
  const path = event.path.replace(/^(\/\.netlify\/functions)?\/site\//, '');
  switch (path) {
    case 'wakeup':
      respond.noContent();
      return;
    case 'payment-authorize':
      authorizePayment(event, respond);
      return;
    case 'payment-capture':
      capturePayment(event, respond);
      return;
  }

  if (path.startsWith('download/web/')) {
    webDownload(event, respond);
    return;
  }

  respond.notFound();
}
