import { cartPlusData } from '../../models/__tests__/fixtures';
import Cart from '../../models/Cart';
import CheckoutService from '../CheckoutService';
import CheckoutApi from '../CheckoutApi';

const { endpoint, origin } = urls();

describe('CheckoutService()', () => {
  let service: CheckoutService;
  let api: CheckoutApi;
  let cart: Cart;

  console.log(`Running integration tests against: ${origin}`);

  beforeEach(() => {
    cart = getCart();
    api = new CheckoutApi(endpoint);
    service = new CheckoutService(cart, api);
  });

  test('wakeup should return 204 OK', async () => {
    const res = await api.wakeup();
    expect(res.ok).toBe(true);
    expect(res.statusCode).toBe(204);
  });

  test('sequential, stateful checkout fns', async () => {
    let err: string | void;

    // step 1: calculate fees
    err = await service.calculateFees();
    expect(service.fees).toEqual({ shipping: 399, taxes: 0, ccFeeOffset: 42 });

    // step 2, create order and authorize payment
    err = await service.createOrder();
    expect(err).toBeNull();
    expect(service.paymentIntentId).toMatch(/^pi_\w+$/i);
    expect(service.paymentIntentClientSecret).toMatch(/^pi_\w+?_secret_\w+$/i);
    expect(service.orderId).toMatch(/^[a-f\d]{24}$/i);

    // step 2.5 (testing only, because not using stripe js client)
    err = await service.__testonly__authorizePayment();
    expect(err).toBeNull();

    // step 3: verify that the order was created
    let orderRes = await api.getOrder(service.orderId);
    expect(orderRes.data).toMatchObject({
      payment: {
        id: service.paymentIntentId,
        shipping: 399,
        taxes: 0,
        cc_fee_offset: 42,
      },
    });

    // step 4: crate the print job
    err = await service.createPrintJob();

    // step 5: verify order updated
    orderRes = await api.getOrder(service.orderId);
    expect(orderRes.data).toMatchObject({
      print_job: {
        id: service.printJobId,
        status: 'pending',
      },
    });

    // step 6: wait for print job validation
    err = await service.verifyPrintJobAccepted();
    expect(err).toBeNull();

    // step 7: update order print job status
    err = await service.updateOrderPrintJobStatus();
    expect(err).toBeNull();

    // step 8: verify print job status updated
    orderRes = await api.getOrder(service.orderId);
    expect(orderRes.data).toMatchObject({
      print_job: { status: 'accepted' },
    });

    // step 9: capture the payment
    err = await service.capturePayment();
    expect(err).toBeNull();

    // step 10: verify order payment.status updated
    orderRes = await api.getOrder(service.orderId);
    expect(orderRes.data).toMatchObject({
      payment: { status: 'captured' },
    });

    // step 11: send order confirmation email
    const confirmRes = await api.sendOrderConfirmationEmail(service.orderId);
    expect(confirmRes.statusCode).toBe(204);
  }, 30000);
});

function getCart(): Cart {
  const testCart = cartPlusData();
  const item = testCart.items[0];
  item.title = ['Journal of Ambrose Rigge (modernized)'];
  item.numPages = [166];
  item.printSize = 'm';
  item.coverPdfUrl = [
    'https://flp-assets.nyc3.digitaloceanspaces.com/en/ambrose-rigge/journal-and-writings/modernized/Journal_of_Ambrose_Rigge--modernized--cover.pdf',
  ];
  item.interiorPdfUrl = [
    'https://flp-assets.nyc3.digitaloceanspaces.com/en/ambrose-rigge/journal-and-writings/modernized/Journal_of_Ambrose_Rigge--modernized--(print).pdf',
  ];
  testCart.items = [item];
  return testCart;
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
