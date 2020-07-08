import { checkoutErrors as Err } from '@friends-library/types';
import CheckoutApi, { ApiResponse } from './CheckoutApi';
import Cart from '../models/Cart';
import { LANG } from '../../env';

/**
 * CheckoutService exists to orchestrate the series of lambda invocations
 * necessary for checking out. It builds up necessary intermediate state
 * (things like orderId, paymentIntentId) in order to pass correct
 * values to the various lambdas throughout the sequence. The CheckoutApi
 * is injected as an independent service for easier unit testing and usage
 * within Storybook.
 */
export default class CheckoutService {
  private errors: string[] = [];
  private stripeError?: string;
  public orderId = ``;
  public paymentIntentId = ``;
  public paymentIntentClientSecret = ``;
  public shippingLevel = ``;
  public fees = {
    shipping: 0,
    taxes: 0,
    ccFeeOffset: 0,
  };

  public constructor(public cart: Cart, private api: CheckoutApi) {}

  public brickOrder(stateHistory: string[]): void {
    this.api.brickOrder(stateHistory, this.orderId, this.paymentIntentId);
    this.resetState();
  }

  public async calculateFees(): Promise<string | void> {
    const payload = {
      address: this.cart.address,
      items: this.cart.items
        .filter(i => i.quantity > 0)
        .flatMap(item =>
          item.numPages.map(pages => ({
            pages,
            printSize: item.printSize,
            quantity: item.quantity,
          })),
        ),
    };

    if (!this.cart.address) throw new Error(`Missing address`);

    const res = await this.api.calculateFees(payload);
    if (res.ok) {
      this.cart.address.unusable = false;
      this.shippingLevel = res.data.shippingLevel;
      this.fees = {
        shipping: res.data.shipping,
        taxes: res.data.taxes,
        ccFeeOffset: res.data.ccFeeOffset,
      };
      return;
    }

    if (res.data.msg === Err.SHIPPING_NOT_POSSIBLE) {
      this.cart.address.unusable = true;
    }

    return this.resolve(res);
  }

  public async createPaymentIntent(): Promise<string | void> {
    const payload = { amount: this.cart.subTotal() + this.sumFees() };
    const res = await this.api.createPaymentIntent(payload);
    if (res.ok) {
      this.paymentIntentId = res.data.paymentIntentId;
      this.paymentIntentClientSecret = res.data.paymentIntentClientSecret;
      this.orderId = res.data.orderId;
    }
    return this.resolve(res);
  }

  public async createOrder(): Promise<string | void> {
    const res = await this.api.createOrder(this.createOrderPayload());
    return this.resolve(res);
  }

  public async chargeCreditCard(
    chargeCreditCard: () => Promise<Record<string, any>>,
  ): Promise<string | void> {
    const res = await this.api.chargeCreditCard(chargeCreditCard);
    if (!res.ok && typeof res.data.userMsg === `string`) {
      this.stripeError = res.data.userMsg;
    }
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

  public complete(): void {
    this.resetState();
    this.cart.items = [];
  }

  public peekStripeError(): string | undefined {
    return this.stripeError;
  }

  public popStripeError(): string | undefined {
    const error = this.stripeError;
    delete this.stripeError;
    return error;
  }

  private resolve({ ok, data, statusCode }: ApiResponse): string | void {
    if (!ok) {
      const msg = data.msg || `Status: ${statusCode}`;
      this.errors.push(msg);
      return msg;
    }
  }

  private sumFees(): number {
    return Object.values(this.fees).reduce((sum, fee) => sum + fee);
  }

  private createOrderPayload(): Record<string, any> {
    const { shipping, taxes, ccFeeOffset } = this.fees;
    if (!this.cart.address) throw new Error(`Missing address`);
    return {
      id: this.orderId,
      paymentId: this.paymentIntentId,
      amount: this.cart.subTotal() + this.sumFees(),
      shipping,
      taxes,
      ccFeeOffset,
      email: this.cart.email,
      shippingLevel: this.shippingLevel,
      address: {
        name: this.cart.address.name,
        street: this.cart.address.street,
        street2: this.cart.address.street2,
        city: this.cart.address.city,
        state: this.cart.address.state,
        zip: this.cart.address.zip,
        country: this.cart.address.country,
      },
      lang: LANG,
      items: this.cart.items
        .filter(i => i.quantity > 0)
        .map(item => ({
          title: item.printJobTitle(0),
          documentId: item.documentId,
          edition: item.edition,
          quantity: item.quantity,
          unitPrice: item.price(),
        })),
    };
  }

  private resetState(): void {
    this.errors = [];
    this.orderId = ``;
    this.paymentIntentId = ``;
    this.paymentIntentClientSecret = ``;
    this.shippingLevel = ``;
    this.fees = { shipping: 0, taxes: 0, ccFeeOffset: 0 };
    delete this.stripeError;
  }
}
