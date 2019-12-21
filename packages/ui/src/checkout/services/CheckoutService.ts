import { checkoutErrors as Err } from '@friends-library/types';
import CheckoutApi, { ApiResponse } from './CheckoutApi';
import Cart from '../models/Cart';
import { PrintJobStatus } from '@friends-library/types';

/**
 * CheckoutService exists to orchestrate the series of lambda invocations
 * necessary for checking out. It builds up necessary intermediate state
 * (things like orderId, printJobId, paymentIntentId) in order to pass correct
 * values to the various lambdas throughout the sequence. The CheckoutApi
 * is injected as an independent service for easier unit testing and usage
 * within Storybook.
 */
export default class CheckoutService {
  private errors: string[] = [];
  public orderId = '';
  public paymentIntentId = '';
  public paymentIntentClientSecret = '';
  public shippingLevel = '';
  public printJobId = -1;
  public printJobStatus?: PrintJobStatus;
  public fees = {
    shipping: 0,
    taxes: 0,
    ccFeeOffset: 0,
  };

  public constructor(public cart: Cart, private api: CheckoutApi) {}

  public async calculateFees(): Promise<string | void> {
    const payload = {
      address: this.cart.address,
      items: this.cart.items.flatMap(item =>
        item.numPages.map(pages => ({
          pages,
          printSize: item.printSize,
          quantity: item.quantity,
        })),
      ),
    };

    if (!this.cart.address) throw new Error('Missing address');

    const { ok, data } = await this.api.calculateFees(payload);
    if (ok) {
      this.cart.address.unusable = false;
      this.shippingLevel = data.shippingLevel;
      this.fees = {
        shipping: data.shipping,
        taxes: data.taxes,
        ccFeeOffset: data.ccFeeOffset,
      };
      return;
    }

    if (data.msg === Err.SHIPPING_NOT_POSSIBLE) {
      this.cart.address.unusable = true;
    }

    this.errors.push(data.msg);
    return data.msg;
  }

  public async createOrder(): Promise<string | void> {
    const { shipping, taxes, ccFeeOffset } = this.fees;
    const payload = {
      amount: this.cart.subTotal() + this.sumFees(),
      shipping,
      taxes,
      ccFeeOffset,
      email: this.cart.email,
      address: this.cart.address,
      items: this.cart.items.map(item => ({
        documentId: item.documentId,
        edition: item.edition,
        quantity: item.quantity,
        unitPrice: item.price(),
      })),
    };

    const { ok, data } = await this.api.createOrder(payload);
    if (!ok) {
      this.errors.push(data.msg);
      return data.msg;
    }

    this.paymentIntentId = data.paymentIntentId;
    this.paymentIntentClientSecret = data.paymentIntentClientSecret;
    this.orderId = data.orderId;
  }

  public async createPrintJob(): Promise<string | void> {
    const payload = {
      orderId: this.orderId,
      paymentIntentId: this.paymentIntentId,
      shippingLevel: this.shippingLevel,
      email: this.cart.email,
      address: this.cart.address,
      items: this.cart.items.flatMap(i =>
        i.numPages.map((pages, idx) => ({
          title: i.printJobTitle(idx),
          coverUrl: i.coverPdfUrl[idx],
          interiorUrl: i.interiorPdfUrl[idx],
          printSize: i.printSize,
          pages,
          quantity: i.quantity,
        })),
      ),
    };

    const { ok, data } = await this.api.createPrintJob(payload);
    if (!ok) {
      this.errors.push(data.msg);
      return data.msg;
    }

    this.printJobId = data.printJobId;
  }

  public async verifyPrintJobAccepted(): Promise<string | void> {
    let attempts = 0;
    do {
      this.printJobStatus && (await new Promise(resolve => setTimeout(resolve, 500)));
      const { ok, data } = await this.api.getPrintJobStatus(this.printJobId);
      if (ok) {
        this.errors.push(data.msg);
        this.printJobStatus = data.status;
      }
    } while (this.printJobStatus !== 'accepted' && attempts++ < 60);

    if (this.printJobStatus === 'accepted') {
      return;
    }

    return 'print_job_acceptance_verification_timeout';
  }

  public async updateOrderPrintJobStatus(): Promise<string | void> {
    const res = await this.api.updateOrder(this.orderId, {
      'print_job.status': this.printJobStatus,
    });
    return this.resolve(res);
  }

  public async authorizePayment(
    authorizePayment: () => Promise<Record<string, any>>,
  ): Promise<string | void> {
    const res = await this.api.authorizePayment(authorizePayment);
    return this.resolve(res);
  }

  // eslint-disable-next-line @typescript-eslint/camelcase
  public async __testonly__authorizePayment(): Promise<string | void> {
    const res = await this.api.__testonly__authorizePayment({
      paymentIntentId: this.paymentIntentId,
    });
    return this.resolve(res);
  }

  public async capturePayment(): Promise<string | void> {
    const res = await this.api.capturePayment({
      paymentIntentId: this.paymentIntentId,
      orderId: this.orderId,
    });
    return this.resolve(res);
  }

  public async sendWakeup(): Promise<string | void> {
    const res = await this.api.wakeup();
    return this.resolve(res);
  }

  public async sendOrderConfirmationEmail(): Promise<string | void> {
    const res = await this.api.sendOrderConfirmationEmail(this.orderId);
    return this.resolve(res);
  }

  public popError(): string | undefined {
    return this.errors.pop();
  }

  public lastError(): string | undefined {
    return this.errors[this.errors.length - 1];
  }

  private resolve({ ok, data }: ApiResponse): string | void {
    if (!ok) {
      this.errors.push(data.msg);
      return data.msg;
    }
  }

  private sumFees(): number {
    return Object.values(this.fees).reduce((sum, fee) => sum + fee);
  }
}
