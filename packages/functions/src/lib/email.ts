import { Document } from 'mongoose';

export function orderShippedEmail(
  order: Document,
  trackingUrl: string,
): { subject: string; text: string } {
  return {
    subject: '[,] Friends Library Order Shipped',
    text: ORDER_SHIPPED_EMAIL_EN.replace('{{salutation}}', salutation(order, 'Hello!'))
      .replace('{{lineItems}}', lineItems(order))
      .replace('{{trackingUrl}}', trackingUrl)
      .replace('{{orderId}}', order.id),
  };
}

export function orderConfirmationEmail(
  order: Document,
): { subject: string; text: string } {
  return {
    subject: '[,] Friends Library Order Confirmation',
    text: CONFIRMATION_EMAIL_EN.replace('{{salutation}}', salutation(order, 'Hello!'))
      .replace('{{lineItems}}', lineItems(order))
      .replace('{{orderId}}', order.id),
  };
}

function salutation(order: Document, fallback: string): string {
  const name = order.get('address.name');
  if (typeof name === 'string') {
    return name.split(' ').shift() + ',';
  }
  return fallback;
}

function lineItems(order: Document): string {
  const items: { title: string; quantity: number }[] = order.get('items') || [];
  return items.map(item => `* (${item.quantity}) ${item.title}`).join('\n');
}

const CONFIRMATION_EMAIL_EN = `
{{salutation}}

'Thanks for ordering from Friends Library Publishing! Your order was successfully created with the following item(s):'

{{lineItems}}

For your reference, your order id is: {{orderId}}. We'll be sending you one more email in a few days with your tracking number, as soon as it ships. For many shipping addresses, a normal delivery date is around 7 to 14 days after purchase.

Please don't hesitate to let us know if you have any questions!

- Friends Library Publishing
`.trim();

const ORDER_SHIPPED_EMAIL_EN = `
{{salutation}}

Good news! Your order ({{orderId}}) containing the following item(s) has shipped:

{{lineItems}}

To track your package, you can use the below link:

{{trackingUrl}}

Please don't hesitate to let us know if you have any questions!

- Friends Library Publishing
`.trim();
