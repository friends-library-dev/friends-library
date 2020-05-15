import fetch from 'node-fetch';
import { schema as feesSchema } from '../print-job-fees';
import { schema as createOrderSchema } from '../order-create';
import { schema as createPrintJobSchema } from '../print-job-create';

describe('site fns integration', () => {
  const { endpoint, origin } = urls();
  console.log(`Running integration tests against: ${origin}`);

  test('GET /wakeup should return 204', async () => {
    const { status } = await fetch(`${endpoint}/wakeup`);
    expect(status).toBe(204);
  });

  const path =
    'log/download/9333dd0a-d92b-401e-a086-f611cc20f984/en/hugh-turford/walk-in-the-spirit/updated/epub/Walk_in_the_Spirit--updated.epub';

  test('GET /download should return 302 (w/ IP)', async () => {
    const { status } = await fetch(`${endpoint}/${path}`, {
      redirect: 'manual',
      headers: { 'client-ip': '71.79.157.162' },
    });
    expect(status).toBe(302);
  });

  test('GET /download should return 302 (no IP)', async () => {
    const { status } = await fetch(`${endpoint}/${path}`, { redirect: 'manual' });
    expect(status).toBe(302);
  });

  test('POST /print-job/fees endpoint', async () => {
    const res = await fetch(`${endpoint}/print-job/fees`, {
      method: 'POST',
      body: JSON.stringify(feesSchema.example),
      headers,
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      shippingLevel: 'MAIL',
      shipping: 399,
      taxes: 0,
      ccFeeOffset: 42,
    });
  }, 10000);

  test('sequential, stateful checkout fns', async () => {
    /**
     * Step 1: Authorize payment, retrieving an `orderId`, `paymentIntentId`, etc.
     */
    const email = `integration-${Date.now()}@test.com`;
    const authRes = await fetch(`${endpoint}/orders/create`, {
      method: 'POST',
      body: JSON.stringify({ ...createOrderSchema.example, email }),
      headers,
    });

    const authResJson = await authRes.json();
    const { paymentIntentId, paymentIntentClientSecret, orderId } = authResJson;
    expect(authRes.status).toBe(201);
    expect(paymentIntentId).toMatch(/^pi_\w+$/i);
    expect(paymentIntentClientSecret).toMatch(/^pi_\w+?_secret_\w+$/i);
    expect(orderId).toMatch(/^[a-f\d-]{36}$/i);

    /**
     * Step 2: Verify that our order was created
     */
    let orderRes = await fetch(`${endpoint}/orders/${orderId}`);
    expect(orderRes.status).toBe(200);
    expect(await orderRes.json()).toMatchObject({
      email,
      paymentId: paymentIntentId,
      paymentStatus: 'authorized',
      amount: createOrderSchema.example.amount,
      shipping: createOrderSchema.example.shipping,
      taxes: createOrderSchema.example.taxes,
      ccFeeOffset: createOrderSchema.example.ccFeeOffset,
    });

    /**
     * Step 2.5 (only required here, since no js client):
     * Confirm payment intent with payment method
     */
    const confirmRes = await fetch(`${endpoint}/payment/authorize`, {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
      headers,
    });
    expect(confirmRes.status).toBe(204);

    /**
     * Step 3: Create print job
     */
    const createPrintJobBody = {
      ...createPrintJobSchema.example,
      orderId,
      paymentIntentId,
    };
    const createPrintJobRes = await fetch(`${endpoint}/print-job`, {
      method: 'POST',
      body: JSON.stringify(createPrintJobBody),
      headers,
    });

    const { printJobId } = await createPrintJobRes.json();
    expect(createPrintJobRes.status).toBe(201);
    expect(Number.isInteger(printJobId)).toBe(true);

    /**
     * Step 4: Verify that our order was updated
     */
    orderRes = await fetch(`${endpoint}/orders/${orderId}`);
    expect(orderRes.status).toBe(200);
    expect(await orderRes.json()).toMatchObject({
      printJobId: printJobId,
      printJobStatus: 'pending',
    });

    /**
     * Step 5: Poll Lulu for order validation
     */
    let orderStatus: null | string = null;
    do {
      orderStatus && (await delay(1000));
      const statusRes = await fetch(`${endpoint}/print-job/${printJobId}/status`);
      expect(statusRes.status).toBe(200);
      ({ status: orderStatus } = await statusRes.json());
    } while (orderStatus !== 'accepted');

    /**
     * Step 7: Update order print job status
     */
    const updateOrderRes = await fetch(`${endpoint}/orders/update-print-job-status`, {
      method: 'POST',
      body: JSON.stringify({ orderId, printJobStatus: 'accepted' }),
      headers,
    });
    expect(updateOrderRes.status).toBe(200);

    /**
     * Step 8: Verify that our order print job status was updated
     */
    orderRes = await fetch(`${endpoint}/orders/${orderId}`);
    expect(orderRes.status).toBe(200);
    expect(await orderRes.json()).toMatchObject({ printJobStatus: 'accepted' });

    /**
     * Step 9: Capture payment
     */
    const captureRes = await fetch(`${endpoint}/payment/capture`, {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId, orderId }),
      headers,
    });
    expect(captureRes.status).toBe(204);

    /**
     * Step 10: Verify that our order payment status was updated
     */
    orderRes = await fetch(`${endpoint}/orders/${orderId}`);
    expect(orderRes.status).toBe(200);
    expect(await orderRes.json()).toMatchObject({ paymentStatus: 'captured' });

    /**
     * Step 11: Send order confirmation email
     */
    const emailRes = await fetch(`${endpoint}/orders/${orderId}/confirmation-email`, {
      method: 'POST',
    });
    expect(emailRes.status).toBe(204);
  }, 60000);
});

const headers = {
  'Content-Type': 'application/json',
};

function delay(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

export function urls(): { endpoint: string; origin: string } {
  let endpoint = 'http://localhost:2345';
  if (process.env.FNS_INTEGRATION_TEST_URL) {
    endpoint = process.env.FNS_INTEGRATION_TEST_URL;
  }
  endpoint += '/.netlify/functions/site';
  const origin = endpoint.split('/.netlify')[0];
  return { endpoint, origin };
}
