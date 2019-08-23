import fetch from 'node-fetch';
import { schema as feesSchema } from '../print-job-fees';
import { schema as authorizeSchema } from '../payment-authorize';
import { schema as createOrderSchema } from '../print-job-create';

describe('site fns integration', () => {
  const { endpoint, origin } = urls();
  console.log(`Running integration tests against: ${origin}`);

  test('GET /wakeup should return 204', async () => {
    const { status } = await fetch(`${endpoint}/wakeup`);
    expect(status).toBe(204);
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
     * Step 1: Authorize payment, retrieving an `orderId` and `chargeId`
     */
    const email = `integration-${Date.now()}@test.com`;
    const authRes = await fetch(`${endpoint}/payment/authorize`, {
      method: 'POST',
      body: JSON.stringify({ ...authorizeSchema.example, email }),
      headers,
    });

    const { chargeId, orderId } = await authRes.json();
    expect(authRes.status).toBe(201);
    expect(chargeId).toMatch(/^ch_[a-z0-9]+$/i);
    expect(orderId).toMatch(/^[a-f\d]{24}$/i);

    /**
     * Step 2: Verify that our order was created
     */
    let orderRes = await fetch(`${endpoint}/orders/${orderId}`);
    expect(orderRes.status).toBe(200);
    expect(await orderRes.json()).toMatchObject({
      email,
      payment: {
        id: chargeId,
        status: 'authorized',
        amount: authorizeSchema.example.amount,
        shipping: authorizeSchema.example.shipping,
        taxes: authorizeSchema.example.taxes,
        cc_fee_offset: authorizeSchema.example.ccFeeOffset,
      },
    });

    /**
     * Step 3: Create print job
     */
    const createOrderBody = { ...createOrderSchema.example, orderId, chargeId };
    const createOrderRes = await fetch(`${endpoint}/print-job`, {
      method: 'POST',
      body: JSON.stringify(createOrderBody),
      headers,
    });

    const { printJobId } = await createOrderRes.json();
    expect(createOrderRes.status).toBe(201);
    expect(Number.isInteger(printJobId)).toBe(true);

    /**
     * Step 4: Verify that our order was updated
     */
    orderRes = await fetch(`${endpoint}/orders/${orderId}`);
    expect(orderRes.status).toBe(200);
    expect(await orderRes.json()).toMatchObject({
      print_job: {
        id: printJobId,
        status: 'pending',
      },
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
     * Step 7: Update order print_job status
     */
    const updateOrderRes = await fetch(`${endpoint}/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ 'print_job.status': 'accepted' }),
      headers,
    });
    expect(updateOrderRes.status).toBe(200);

    /**
     * Step 8: Verify that our order print_job.status was updated
     */
    orderRes = await fetch(`${endpoint}/orders/${orderId}`);
    expect(orderRes.status).toBe(200);
    expect(await orderRes.json()).toMatchObject({
      print_job: { status: 'accepted' },
    });

    /**
     * Step 9: Capture payment
     */
    const captureRes = await fetch(`${endpoint}/payment/capture`, {
      method: 'POST',
      body: JSON.stringify({ chargeId, orderId }),
      headers,
    });
    expect(captureRes.status).toBe(204);

    /**
     * Step 10: Verify that our order payment.status was updated
     */
    orderRes = await fetch(`${endpoint}/orders/${orderId}`);
    expect(orderRes.status).toBe(200);
    expect(await orderRes.json()).toMatchObject({
      payment: { status: 'captured' },
    });
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
  } else if (process.env.PR) {
    endpoint = `https://deploy-preview-${process.env.PR}--en-evans.netlify.com`;
  }
  endpoint += '/.netlify/functions/site';
  const origin = endpoint.split('/.netlify')[0];
  return { endpoint, origin };
}
