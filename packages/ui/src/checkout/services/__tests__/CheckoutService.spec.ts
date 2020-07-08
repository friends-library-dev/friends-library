import CheckoutService from '../CheckoutService';
import CheckoutApi from '../CheckoutApi';
import { cartPlusData } from '../../models/__tests__/fixtures';

jest.useFakeTimers();

describe(`CheckoutService()`, () => {
  let service: CheckoutService;
  const calculateFees = jest.fn();
  const createOrder = jest.fn();

  beforeEach(() => {
    service = new CheckoutService(cartPlusData(), ({
      calculateFees,
      createOrder,
    } as unknown) as CheckoutApi);
    service.orderId = `order-id`;
  });

  describe(`.calculateFees()`, () => {
    beforeEach(() => {
      calculateFees.mockClear();
    });

    it(`passes correct payload to api`, async () => {
      calculateFees.mockResolvedValue({ ok: true, data: {} });

      await service.calculateFees();

      expect(calculateFees).toHaveBeenCalledWith({
        address: service.cart.address,
        items: service.cart.items.flatMap(i =>
          i.numPages.map(pages => ({
            pages,
            printSize: i.printSize,
            quantity: i.quantity,
          })),
        ),
      });
    });

    it(`should return null error and set internal state if success`, async () => {
      calculateFees.mockResolvedValue({
        ok: true,
        data: {
          shippingLevel: `MAIL`,
          shipping: 399,
          taxes: 0,
          ccFeeOffset: 42,
        },
      });

      const err = await service.calculateFees();

      expect(err).toBeUndefined();
      expect(service.shippingLevel).toBe(`MAIL`);
      expect(service.fees).toEqual({
        shipping: 399,
        taxes: 0,
        ccFeeOffset: 42,
      });
    });

    it(`should not send data about item with quantity = 0`, async () => {
      calculateFees.mockResolvedValue({ ok: true, data: {} });
      service.cart.items[0].quantity = 0;
      await service.calculateFees();
      const payloadItems = calculateFees.mock.calls[0][0].items;
      expect(payloadItems[0].quantity).not.toBe(0);
      expect(payloadItems).toHaveLength(2);
    });

    it(`returns error if error`, async () => {
      calculateFees.mockResolvedValue({
        ok: false,
        data: { msg: `shipping_not_possible` },
      });

      const err = await service.calculateFees();

      expect(err).toBe(`shipping_not_possible`);
    });
  });

  describe(`createOrder()`, () => {
    beforeEach(() => createOrder.mockClear());

    it(`passes correct payload to api`, async () => {
      service.shippingLevel = `EXPEDITED`;
      service.paymentIntentId = `pi_123abc`;
      service.fees = { shipping: 1, taxes: 0, ccFeeOffset: 1 };
      createOrder.mockResolvedValue({ ok: true, data: {} });

      await service.createOrder();

      expect(createOrder).toHaveBeenCalledWith({
        lang: `en`,
        amount: service.cart.subTotal() + 2, // 2 = sum of all fees
        paymentId: service.paymentIntentId,
        shippingLevel: service.shippingLevel,
        id: service.orderId,
        shipping: 1,
        taxes: 0,
        ccFeeOffset: 1,
        email: service.cart.email,
        address: {
          name: service.cart.address!.name,
          street: service.cart.address!.street,
          street2: service.cart.address!.street2,
          city: service.cart.address!.city,
          state: service.cart.address!.state,
          zip: service.cart.address!.zip,
          country: service.cart.address!.country,
        },
        items: service.cart.items.map(i => ({
          title: i.printJobTitle(0),
          documentId: i.documentId,
          edition: i.edition,
          quantity: i.quantity,
          unitPrice: i.price(),
        })),
      });
    });

    it(`should not send item with quantity = 0`, async () => {
      service.cart.items[0].quantity = 0;
      createOrder.mockResolvedValue({ ok: true, data: {} });
      await service.createOrder();
      const payloadItems = createOrder.mock.calls[0][0].items;
      expect(payloadItems[0].quantity).not.toBe(0);
      expect(payloadItems).toHaveLength(1);
    });

    it(`should return null error if success`, async () => {
      createOrder.mockResolvedValue({ ok: true, data: { id: `order-id` } });
      const err = await service.createOrder();
      expect(err).toBeUndefined();
    });

    it(`returns error if error`, async () => {
      createOrder.mockResolvedValue({
        ok: false,
        data: { msg: `error_saving_flp_order` },
      });

      const err = await service.createOrder();

      expect(err).toBe(`error_saving_flp_order`);
    });
  });
});
