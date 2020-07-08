import { checkoutErrors as Err } from '@friends-library/types';

export default class CheckoutApi {
  private API_ROOT: string;

  public constructor(API_ROOT: string) {
    this.API_ROOT = API_ROOT.replace(/\/$/, ``);
  }

  public async wakeup(): Promise<ApiResponse> {
    return this.get(`/wakeup`);
  }

  public async brickOrder(
    stateHistory: string[],
    orderId: string,
    paymentIntentId: string,
  ): Promise<ApiResponse> {
    const payload = {
      stateHistory,
      orderId,
      paymentIntentId,
      userAgent: navigator ? navigator.userAgent : null,
    };
    return this.post(`/orders/brick`, payload);
  }

  public async createPaymentIntent(payload: { amount: number }): Promise<ApiResponse> {
    return this.post(`/payment-intent`, payload);
  }

  public async calculateFees(payload: Record<string, any>): Promise<ApiResponse> {
    return this.post(`/print-job/fees`, payload);
  }

  public async createOrder(payload: Record<string, any>): Promise<ApiResponse> {
    return this.post(`/orders`, payload);
  }

  public async chargeCreditCard(
    charge: () => Promise<Record<string, any>>,
  ): Promise<ApiResponse> {
    try {
      var res = await charge();
    } catch (error) {
      return {
        ok: false,
        statusCode: 500,
        data: {
          msg: Err.ERROR_CONFIRMING_STRIPE_CARD_PAYMENT,
          details: error.message,
        },
      };
    }

    if (res.error) {
      return {
        ok: false,
        statusCode: 500,
        data: {
          msg: Err.ERROR_CONFIRMING_STRIPE_CARD_PAYMENT,
          userMsg: res.error.message,
        },
      };
    }

    return { ok: true, statusCode: 200, data: {} };
  }

  public async sendOrderConfirmationEmail(orderId: string): Promise<ApiResponse> {
    const response = await window.fetch(
      this.endpoint(`/orders/${orderId}/confirmation-email`),
      { method: `POST`, credentials: `omit` },
    );
    return this.normalize(response);
  }

  private async get(path: string): Promise<ApiResponse> {
    const response = await window.fetch(this.endpoint(path), { credentials: `omit` });
    return await this.normalize(response);
  }

  private async post(path: string, payload: Record<string, any>): Promise<ApiResponse> {
    return this.sendJson(path, payload, `POST`);
  }

  private async sendJson(
    path: string,
    payload: Record<string, any>,
    method: 'POST' | 'PATCH' | 'PUT',
  ): Promise<ApiResponse> {
    const response = await window.fetch(this.endpoint(path), {
      method,
      body: JSON.stringify(payload),
      credentials: `omit`,
      headers: {
        'Content-Type': `application/json`,
        Accept: `application/json`,
      },
    });
    return this.normalize(response);
  }

  private endpoint(path: string): string {
    return `${this.API_ROOT}/${path.replace(/^\//, ``)}`;
  }

  private async normalize(response: Response): Promise<ApiResponse> {
    let data: ApiResponse['data'] = {};
    const statusCode = response.status;
    const ok = statusCode >= 200 && statusCode < 300;
    if (statusCode !== 204) {
      try {
        data = await response.json();
      } catch {
        data = {};
      }
    }
    return { statusCode, data, ok };
  }
}

export interface ApiResponse {
  ok: boolean;
  statusCode: number;
  data: Record<string, any>;
}
