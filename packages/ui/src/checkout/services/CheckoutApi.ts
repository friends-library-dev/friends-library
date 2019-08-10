import fetch, { Response } from 'node-fetch';

export default class CheckoutApi {
  private API_ROOT: string;

  public constructor(API_ROOT: string) {
    this.API_ROOT = API_ROOT.replace(/\/$/, '');
  }

  public async wakeup(): Promise<ApiResponse> {
    return this.get('/wakeup');
  }

  public async calculateFees(payload: Record<string, any>): Promise<ApiResponse> {
    return this.post('/print-job/fees', payload);
  }

  public async authorizePayment(payload: Record<string, any>): Promise<ApiResponse> {
    return this.post('/payment/authorize', payload);
  }

  public async capturePayment(payload: Record<string, any>): Promise<ApiResponse> {
    return this.post('/payment/capture', payload);
  }

  public async createPrintJob(payload: Record<string, any>): Promise<ApiResponse> {
    return this.post('/print-job', payload);
  }

  public async updateOrder(
    orderId: string,
    payload: Record<string, any>,
  ): Promise<ApiResponse> {
    return this.patch(`/order/${orderId}`, payload);
  }

  public async getPrintJobStatus(printJobId: number): Promise<ApiResponse> {
    return this.get(`/print-job/${printJobId}/status`);
  }

  private async get(path: string): Promise<ApiResponse> {
    const response = await fetch(this.endpoint(path));
    return await this.normalize(response);
  }

  private async post(path: string, payload: Record<string, any>): Promise<ApiResponse> {
    return this.sendJson(path, payload, 'POST');
  }

  private async patch(path: string, payload: Record<string, any>): Promise<ApiResponse> {
    return this.sendJson(path, payload, 'PATCH');
  }

  private async sendJson(
    path: string,
    payload: Record<string, any>,
    method: 'POST' | 'PATCH' | 'PUT',
  ): Promise<ApiResponse> {
    const response = await fetch(this.endpoint(path), {
      method,
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return this.normalize(response);
  }

  private endpoint(path: string): string {
    return `${this.API_ROOT}/${path.replace(/^\//, '')}`;
  }

  private async normalize(response: Response): Promise<ApiResponse> {
    let data: ApiResponse['data'] = {};
    const statusCode = response.status;
    if (statusCode !== 204) {
      try {
        data = await response.json();
      } catch {
        data = {};
      }
    }
    return { statusCode, data };
  }
}

export interface ApiResponse {
  statusCode: number;
  data: Record<string, any>;
}
