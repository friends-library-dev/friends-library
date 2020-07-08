import fetch from 'node-fetch';
import { schema as feesSchema } from '../print-job-fees';
import { schema as createOrderSchema } from '../order-create';

describe(`site fns integration`, () => {
  const { endpoint, origin } = urls();
  console.log(`Running integration tests against: ${origin}`);

  test(`GET /wakeup should return 204`, async () => {
    const { status } = await fetch(`${endpoint}/wakeup`);
    expect(status).toBe(204);
  });

  const path = `log/download/9333dd0a-d92b-401e-a086-f611cc20f984/en/hugh-turford/walk-in-the-spirit/updated/epub/Walk_in_the_Spirit--updated.epub`;

  test(`GET /download should return 302 (w/ IP)`, async () => {
    const { status } = await fetch(`${endpoint}/${path}`, {
      redirect: `manual`,
      headers: { 'client-ip': `71.79.157.162` },
    });
    expect(status).toBe(302);
  });

  test(`GET /download should return 302 (no IP)`, async () => {
    const { status } = await fetch(`${endpoint}/${path}`, { redirect: `manual` });
    expect(status).toBe(302);
  });

  test(`POST /print-job/fees endpoint`, async () => {
    const res = await fetch(`${endpoint}/print-job/fees`, {
      method: `POST`,
      body: JSON.stringify(feesSchema.example),
      headers,
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      shippingLevel: `MAIL`,
      shipping: 399,
      taxes: 0,
      ccFeeOffset: 42,
    });
  }, 10000);

  test(`sequential, stateful checkout fns`, async () => {
    /**
     * Step 1: Create a payment intent
     */
    const piRes = await fetch(`${endpoint}/payment-intent`, {
      method: `POST`,
      body: JSON.stringify({ amount: 2349 }),
      headers,
    });

    const piResJson = await piRes.json();
    const { paymentIntentId, paymentIntentClientSecret, orderId } = piResJson;
    expect(piRes.status).toBe(201);
    expect(paymentIntentId).toMatch(/^pi_\w+$/i);
    expect(paymentIntentClientSecret).toMatch(/^pi_\w+?_secret_\w+$/i);
    expect(orderId).toMatch(/^[a-f\d-]{36}$/i);

    /**
     * Step 2: Create the order
     */
    const orderRes = await fetch(`${endpoint}/orders`, {
      method: `POST`,
      body: JSON.stringify({
        ...createOrderSchema.example,
        id: orderId,
        paymentId: paymentIntentId,
        email: `integration@test.com`,
      }),
      headers,
    });

    const orderResJson = await orderRes.json();
    expect(orderRes.status).toBe(201);
    expect(orderResJson.id).toBe(orderId);
    expect(orderResJson.paymentId).toBe(paymentIntentId);

    /**
     * Step 3: Send order confirmation email
     */
    const emailRes = await fetch(`${endpoint}/orders/${orderId}/confirmation-email`, {
      method: `POST`,
    });
    expect(emailRes.status).toBe(204);
  }, 40000);
});

const headers = {
  'Content-Type': `application/json`,
};

export function urls(): { endpoint: string; origin: string } {
  let endpoint = `http://localhost:2345`;
  if (process.env.FNS_INTEGRATION_TEST_URL) {
    endpoint = process.env.FNS_INTEGRATION_TEST_URL;
  }
  endpoint += `/.netlify/functions/site`;
  const origin = endpoint.split(`/.netlify`)[0];
  return { endpoint, origin };
}
