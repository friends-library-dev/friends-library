import CheckoutService from '../CheckoutService';
import CheckoutApi from '../CheckoutApi';
import { cartPlusData } from '../../models/__tests__/fixtures';

jest.useFakeTimers();

describe('CheckoutService()', () => {
  let service: CheckoutService;
  const calculateFees = jest.fn();
  const authorizePayment = jest.fn();
  const createPrintJob = jest.fn();
  const getPrintJobStatus = jest.fn();
  const updateOrder = jest.fn();
  const capturePayment = jest.fn();

  beforeEach(() => {
    service = new CheckoutService(({
      calculateFees,
      authorizePayment,
      createPrintJob,
      getPrintJobStatus,
      updateOrder,
      capturePayment,
    } as unknown) as CheckoutApi);
  });

  describe('.calculateFees()', () => {
    it('passes correct payload to api', async () => {
      const cart = cartPlusData();
      calculateFees.mockResolvedValue({ ok: true, data: {} });

      await service.calculateFees(cart);

      expect(calculateFees).toHaveBeenCalledWith({
        address: cart.address,
        items: cart.items.map(i => ({
          pages: i.numPages,
          printSize: i.printSize,
          quantity: i.quantity,
        })),
      });
    });

    it('should return null error and set internal state if success', async () => {
      calculateFees.mockResolvedValue({
        ok: true,
        data: {
          shippingLevel: 'MAIL',
          shipping: 399,
          taxes: 0,
          ccFeeOffset: 42,
        },
      });

      const [err] = await service.calculateFees(cartPlusData());

      expect(err).toBeNull();
      expect(service.shippingLevel).toBe('MAIL');
      expect(service.fees).toEqual({
        shipping: 399,
        taxes: 0,
        ccFeeOffset: 42,
      });
    });

    it('returns error if error', async () => {
      calculateFees.mockResolvedValue({
        ok: false,
        data: { msg: 'shipping_not_possible' },
      });

      const [err] = await service.calculateFees(cartPlusData());

      expect(err).toBe('shipping_not_possible');
    });
  });

  describe('createOrderAndAuthorizePayment()', () => {
    it('passes correct payload to api', async () => {
      const cart = cartPlusData();
      service.fees = { shipping: 1, taxes: 0, ccFeeOffset: 1 };
      authorizePayment.mockResolvedValue({ ok: true, data: {} });

      await service.createOrderAndAuthorizePayment(cart, 'tok_visa');

      expect(authorizePayment).toHaveBeenCalledWith({
        token: 'tok_visa',
        amount: cart.subTotal() + 2, // 2 = sum of all fees
        shipping: 1,
        taxes: 0,
        ccFeeOffset: 1,
        email: cart.email,
        address: cart.address,
        items: cart.items.map(i => ({
          documentId: i.documentId,
          edition: i.edition,
          quantity: i.quantity,
          unitPrice: i.price(),
        })),
      });
    });

    it('should return null error and set internal state if success', async () => {
      authorizePayment.mockResolvedValue({
        ok: true,
        data: {
          chargeId: 'ch_id',
          orderId: 'order_id',
        },
      });

      const [err] = await service.createOrderAndAuthorizePayment(cartPlusData(), '');

      expect(err).toBeNull();
      expect(service.chargeId).toBe('ch_id');
      expect(service.orderId).toBe('order_id');
    });

    it('returns error if error', async () => {
      authorizePayment.mockResolvedValue({
        ok: false,
        data: { msg: 'error_saving_flp_order' },
      });

      const [err] = await service.createOrderAndAuthorizePayment(cartPlusData(), '');

      expect(err).toBe('error_saving_flp_order');
    });
  });

  describe('createPrintJob()', () => {
    it('passes correct payload to api and sets internal state', async () => {
      const cart = cartPlusData();
      service.orderId = 'order_id';
      service.chargeId = 'ch_id';
      service.shippingLevel = 'PRIORITY_MAIL';
      createPrintJob.mockResolvedValue({ ok: true, data: { printJobId: 6 } });

      await service.createPrintJob(cart);

      expect(createPrintJob).toHaveBeenCalledWith({
        orderId: 'order_id',
        chargeId: 'ch_id',
        shippingLevel: 'PRIORITY_MAIL',
        email: cart.email,
        address: cart.address,
        items: cart.items.map(i => ({
          title: i.printJobTitle(),
          coverUrl: i.coverPdfUrl,
          interiorUrl: i.interiorPdfUrl,
          printSize: i.printSize,
          pages: i.numPages,
          quantity: i.quantity,
        })),
      });

      expect(service.printJobId).toBe(6);
    });
  });

  describe('verifyPrintJobAccepted()', () => {
    beforeEach(() => {
      service.printJobId = 55;
      getPrintJobStatus.mockClear();
    });

    it('should request the status of the print job', async () => {
      getPrintJobStatus.mockResolvedValueOnce(jobStatus('accepted'));

      const [err] = await service.verifyPrintJobAccepted();

      expect(getPrintJobStatus).toHaveBeenCalledWith(55);
      expect(err).toBeNull();
    });

    it('should keep requesting status until it gets accepted', async () => {
      getPrintJobStatus
        .mockResolvedValueOnce(jobStatus('pending'))
        .mockResolvedValueOnce(jobStatus('pending'))
        .mockResolvedValueOnce(jobStatus('accepted'));

      service.verifyPrintJobAccepted();
      await drainPromiseQueue();

      expect(getPrintJobStatus.mock.calls.length).toBe(1);

      jest.advanceTimersByTime(500);
      await drainPromiseQueue();

      expect(getPrintJobStatus.mock.calls.length).toBe(2);

      jest.advanceTimersByTime(500);
      await drainPromiseQueue();

      expect(getPrintJobStatus.mock.calls.length).toBe(3);
    });

    it('returns an error after 30 seconds without acceptance', async () => {
      getPrintJobStatus.mockResolvedValue(jobStatus('pending'));
      const promise = service.verifyPrintJobAccepted();
      for (let i = 0; i <= 60; i++) {
        await drainPromiseQueue();
        jest.runOnlyPendingTimers();
      }
      const [err] = await promise;
      expect(err).toBe('print_job_acceptance_verification_timeout');
    });
  });

  describe('updateOrderPrintJobStatus()', () => {
    it('should send correct orderId & payload to api', async () => {
      service.orderId = '123abc';
      service.printJobStatus = 'rejected';
      updateOrder.mockResolvedValueOnce({ ok: true, data: {} });
      const [err] = await service.updateOrderPrintJobStatus();
      expect(updateOrder).toHaveBeenCalledWith('123abc', {
        'print_job.status': 'rejected',
      });
      expect(err).toBeNull();
    });

    it('returns error if api request errors', async () => {
      service.printJobStatus = 'rejected';
      updateOrder.mockResolvedValueOnce({
        ok: false,
        data: { msg: 'error_updating_order' },
      });
      const [err] = await service.updateOrderPrintJobStatus();
      expect(err).toBe('error_updating_order');
    });
  });

  describe('capturePayment()', () => {
    it('should send correct payload to api', async () => {
      service.orderId = '123abc';
      service.chargeId = 'ch_123';
      capturePayment.mockResolvedValueOnce({ ok: true, data: {} });
      const [err] = await service.capturePayment();
      expect(err).toBeNull();
      expect(capturePayment).toHaveBeenCalledWith({
        orderId: '123abc',
        chargeId: 'ch_123',
      });
    });

    it('should return error if api request errors', async () => {
      capturePayment.mockResolvedValueOnce({
        ok: false,
        data: { msg: 'order_not_found' },
      });
      const [err] = await service.capturePayment();
      expect(err).toBe('order_not_found');
    });
  });
});

function jobStatus(status: string): { ok: true; data: { status: string } } {
  return {
    ok: true,
    data: { status },
  };
}

function drainPromiseQueue() {
  return new Promise(resolve => setImmediate(resolve));
}
