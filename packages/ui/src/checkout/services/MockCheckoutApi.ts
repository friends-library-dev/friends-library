import CheckoutApi, { ApiResponse } from './CheckoutApi';

type MockResponse = ApiResponse & { delay?: number };

export default class MockCheckoutApi extends CheckoutApi {
  private responses: {
    [k: string]: { default: MockResponse; stack?: MockResponse[] };
  } = {
    wakeup: {
      default: {
        ok: true,
        statusCode: 204,
        data: {},
      },
    },
    calculateFees: {
      default: {
        ok: true,
        statusCode: 200,
        data: {
          shippingLevel: `MAIL`,
          shipping: 399,
          taxes: 0,
          ccFeeOffset: 42,
        },
      },
    },
    brickOrder: {
      default: {
        ok: true,
        statusCode: 204,
        data: {},
      },
    },
    chargeCreditCard: {
      default: {
        ok: true,
        statusCode: 200,
        data: {},
      },
    },
    createPaymentIntent: {
      default: {
        ok: true,
        statusCode: 201,
        data: {
          paymentIntentId: `pi_abc`,
          paymentIntentClientSecret: `pi_abc_secret_123`,
          orderId: `order-id`,
        },
      },
    },
    createOrder: {
      default: {
        ok: true,
        statusCode: 201,
        data: {
          orderId: `order-id`,
        },
      },
    },
    sendOrderConfirmationEmail: {
      default: {
        ok: true,
        statusCode: 204,
        data: {},
      },
    },
  };

  public constructor(private defaultDelay: number = 0) {
    super(``);
  }

  public async wakeup(): Promise<ApiResponse> {
    return this.getResponse(`wakeup`);
  }

  public async calculateFees(): Promise<ApiResponse> {
    return this.getResponse(`calculateFees`);
  }

  public async createPaymentIntent(): Promise<ApiResponse> {
    return this.getResponse(`createPaymentIntent`);
  }

  public async createOrder(): Promise<ApiResponse> {
    return this.getResponse(`createOrder`);
  }

  public async chargeCreditCard(): Promise<ApiResponse> {
    return this.getResponse(`chargeCreditCard`);
  }

  public async brickOrder(): Promise<ApiResponse> {
    return this.getResponse(`brickOrder`);
  }

  public async sendOrderConfirmationEmail(): Promise<ApiResponse> {
    return this.getResponse(`sendOrderConfirmationEmail`);
  }

  public setResponse(method: string, response: MockResponse): void {
    if (!this.responses[method]) {
      throw new Error(`Unknown method: ${method}`);
    }
    this.responses[method].default = response;
  }

  public pushResponse(method: string, response: MockResponse): void {
    if (!this.responses[method]) {
      throw new Error(`Unknown method: ${method}`);
    }
    if (!this.responses[method].stack) {
      this.responses[method].stack = [];
    }
    (this.responses[method].stack || []).push(response);
  }

  private getResponse(method: string): Promise<ApiResponse> {
    console.log(
      `%cmock checkout api method invoked: %c${method}`,
      `color: grey`,
      `color: blue`,
    );
    const responses = this.responses[method];
    if (responses.stack && responses.stack.length) {
      return this.maybeDelay(responses.stack.shift() as MockResponse);
    }
    return this.maybeDelay(responses.default);
  }

  private maybeDelay(mockResponse: MockResponse): Promise<ApiResponse> {
    const delay = mockResponse.delay || this.defaultDelay;
    if (delay === 0) {
      return Promise.resolve(mockResponse);
    }
    return new Promise(resolve => setTimeout(() => resolve(mockResponse), delay));
  }
}
