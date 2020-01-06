import CheckoutService from '../CheckoutService';
import CheckoutApi from '../CheckoutApi';
import { cartPlusData } from '../../models/__tests__/fixtures';

jest.useFakeTimers();

describe('CheckoutService()', () => {
  let service: CheckoutService;
  const calculateFees = jest.fn();
  const createOrder = jest.fn();
  const createPrintJob = jest.fn();
  const getPrintJobStatus = jest.fn();
  const updateOrderPrintJobStatus = jest.fn();
  const capturePayment = jest.fn();

  beforeEach(() => {
    service = new CheckoutService(cartPlusData(), ({
      calculateFees,
      createOrder,
      createPrintJob,
      getPrintJobStatus,
      updateOrderPrintJobStatus,
      capturePayment,
    } as unknown) as CheckoutApi);
  });

  describe('.calculateFees()', () => {
    it('passes correct payload to api', async () => {
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

      const err = await service.calculateFees();

      expect(err).toBeUndefined();
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

      const err = await service.calculateFees();

      expect(err).toBe('shipping_not_possible');
    });
  });

  describe('createOrderAndAuthorizePayment()', () => {
    it('passes correct payload to api', async () => {
      service.fees = { shipping: 1, taxes: 0, ccFeeOffset: 1 };
      createOrder.mockResolvedValue({ ok: true, data: {} });

      await service.createOrder();

      expect(createOrder).toHaveBeenCalledWith({
        amount: service.cart.subTotal() + 2, // 2 = sum of all fees
        shipping: 1,
        taxes: 0,
        ccFeeOffset: 1,
        email: service.cart.email,
        address: service.cart.address,
        items: service.cart.items.map(i => ({
          documentId: i.documentId,
          edition: i.edition,
          quantity: i.quantity,
          unitPrice: i.price(),
        })),
      });
    });

    it('should return null error and set internal state if success', async () => {
      createOrder.mockResolvedValue({
        ok: true,
        data: {
          paymentIntentClientSecret: 'pi_id_secret_123',
          paymentIntentId: 'pi_id',
          orderId: 'order_id',
        },
      });

      const err = await service.createOrder();

      expect(err).toBeUndefined();
      expect(service.paymentIntentId).toBe('pi_id');
      expect(service.paymentIntentClientSecret).toBe('pi_id_secret_123');
      expect(service.orderId).toBe('order_id');
    });

    it('returns error if error', async () => {
      createOrder.mockResolvedValue({
        ok: false,
        data: { msg: 'error_saving_flp_order' },
      });

      const err = await service.createOrder();

      expect(err).toBe('error_saving_flp_order');
    });
  });

  describe('createPrintJob()', () => {
    it('passes correct payload to api and sets internal state', async () => {
      service.orderId = 'order_id';
      service.paymentIntentId = 'pi_id';
      service.shippingLevel = 'PRIORITY_MAIL';
      createPrintJob.mockResolvedValue({ ok: true, data: { printJobId: 6 } });

      await service.createPrintJob();

      expect(createPrintJob).toHaveBeenCalledWith({
        orderId: 'order_id',
        paymentIntentId: 'pi_id',
        shippingLevel: 'PRIORITY_MAIL',
        email: service.cart.email,
        address: service.cart.address,
        items: service.cart.items.flatMap(i =>
          i.numPages.map((pages, idx) => ({
            title: i.printJobTitle(idx),
            coverUrl: i.coverPdfUrl[idx],
            interiorUrl: i.interiorPdfUrl[idx],
            printSize: i.printSize,
            pages,
            quantity: i.quantity,
          })),
        ),
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

      const err = await service.verifyPrintJobAccepted();

      expect(getPrintJobStatus).toHaveBeenCalledWith(55);
      expect(err).toBeUndefined();
    });

    it('should keep requesting status until it gets accepted', async () => {
      getPrintJobStatus
        .mockResolvedValueOnce(jobStatus('pending'))
        .mockResolvedValueOnce(jobStatus('pending'))
        .mockResolvedValueOnce(jobStatus('accepted'));

      service.verifyPrintJobAccepted();
      await drainPromiseQueue();

      expect(getPrintJobStatus.mock.calls.length).toBe(1);

      jest.advanceTimersByTime(1000);
      await drainPromiseQueue();

      expect(getPrintJobStatus.mock.calls.length).toBe(2);

      jest.advanceTimersByTime(1000);
      await drainPromiseQueue();

      expect(getPrintJobStatus.mock.calls.length).toBe(3);
    });

    it('returns an error after 45 seconds without acceptance', async () => {
      getPrintJobStatus.mockResolvedValue(jobStatus('pending'));
      const promise = service.verifyPrintJobAccepted();
      for (let i = 0; i <= 45; i++) {
        await drainPromiseQueue();
        jest.runOnlyPendingTimers();
      }
      const err = await promise;
      expect(err).toBe('print_job_acceptance_verification_timeout');
    });
  });

  describe('updateOrderPrintJobStatus()', () => {
    it('should send correct orderId & payload to api', async () => {
      service.orderId = '123abc';
      service.printJobStatus = 'rejected';
      updateOrderPrintJobStatus.mockResolvedValueOnce({ ok: true, data: {} });
      const err = await service.updateOrderPrintJobStatus();
      expect(updateOrderPrintJobStatus).toHaveBeenCalledWith({
        orderId: '123abc',
        printJobStatus: 'rejected',
      });
      expect(err).toBeUndefined();
    });

    it('returns error if api request errors', async () => {
      service.printJobStatus = 'rejected';
      updateOrderPrintJobStatus.mockResolvedValueOnce({
        ok: false,
        data: { msg: 'error_updating_order' },
      });
      const err = await service.updateOrderPrintJobStatus();
      expect(err).toBe('error_updating_order');
    });
  });

  describe('capturePayment()', () => {
    it('should send correct payload to api', async () => {
      service.orderId = '123abc';
      service.paymentIntentId = 'ch_123';
      capturePayment.mockResolvedValueOnce({ ok: true, data: {} });
      const err = await service.capturePayment();
      expect(err).toBeUndefined();
      expect(capturePayment).toHaveBeenCalledWith({
        orderId: '123abc',
        paymentIntentId: 'ch_123',
      });
    });

    it('should return error if api request errors', async () => {
      capturePayment.mockResolvedValueOnce({
        ok: false,
        data: { msg: 'order_not_found' },
      });
      const err = await service.capturePayment();
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
