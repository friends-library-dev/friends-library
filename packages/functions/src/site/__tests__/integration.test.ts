import fetch from 'node-fetch';
import { schema as feesSchema } from '../print-calculate-fees';
import { schema as authorizeSchema } from '../payment-authorize';
import { schema as createOrderSchema } from '../print-create-order';

describe('site fns integration', () => {
  const { endpoint, domain } = urls();
  console.log(`Running integration tests against: ${domain}`);

  test('wakeup should return 204', async () => {
    const { status } = await fetch(`${endpoint}/wakeup`);
    expect(status).toBe(204);
  });

  test('calculate fees endpoint', async () => {
    const res = await fetch(`${endpoint}/print/calculate-fees`, {
      method: 'POST',
      body: JSON.stringify(feesSchema.example),
      headers,
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      shippingLevel: 'MAIL',
      shipping: 399,
      tax: 0,
      ccFee: 42,
    });
  });

  test('sequential, stateful checkout fns', async () => {
    /**
     * Step 1: Authorize payment, retrieving an `orderId` and `chargeId`
     */
    const authRes = await fetch(`${endpoint}/payment/authorize`, {
      method: 'POST',
      body: JSON.stringify({
        ...authorizeSchema.example,
        email: `integration-${Date.now()}@test.com`,
      }),
      headers,
    });

    const { chargeId, orderId } = await authRes.json();
    expect(authRes.status).toBe(201);
    expect(chargeId).toMatch(/^ch_[a-z0-9]+$/i);
    expect(orderId).toMatch(/^[a-z0-9]+$/);

    /**
     * Step 2: Create Lulu print order
     */
    const createOrderBody = { ...createOrderSchema.example, orderId, chargeId };
    const createOrderRes = await fetch(`${endpoint}/print/create-order`, {
      method: 'POST',
      body: JSON.stringify(createOrderBody),
      headers,
    });

    const { luluOrderId } = await createOrderRes.json();
    expect(createOrderRes.status).toBe(201);
    expect(Number.isInteger(luluOrderId)).toBe(true);

    /**
     * Step 3: Poll Lulu for order validation
     */
    let orderStatus: null | string = null;
    do {
      await delay(1000);
      const statusRes = await fetch(`${endpoint}/print/order-status/${luluOrderId}`);
      expect(statusRes.status).toBe(200);
      ({ status: orderStatus } = await statusRes.json());
    } while (orderStatus !== 'accepted');

    /**
     * Step 4: Capture payment
     */
    const captureRes = await fetch(`${endpoint}/payment/capture`, {
      method: 'POST',
      body: JSON.stringify({ chargeId, orderId }),
      headers,
    });
    expect(captureRes.status).toBe(204);
  }, 60000);
});

const headers = {
  'Content-Type': 'application/json',
};

function delay(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

function urls(): { endpoint: string; domain: string } {
  let endpoint = 'http://localhost:2345';
  if (process.env.FNS_INTEGRATION_TEST_URL) {
    endpoint = process.env.FNS_INTEGRATION_TEST_URL;
  } else if (process.env.PR) {
    endpoint = `https://deploy-preview-${process.env.PR}--en-evans.netlify.com`;
  }
  endpoint += '/.netlify/functions/site';
  const domain = endpoint.split('/.netlify')[0];
  return { endpoint, domain };
}
