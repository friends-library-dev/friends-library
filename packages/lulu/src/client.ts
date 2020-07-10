import fetch from 'node-fetch';
import ClientOAuth2 from 'client-oauth2';
import { LuluAPI } from './types';

export default class LuluClient {
  clientKey: string;
  clientSecret: string;
  endpoint: string;
  accessToken?: string;

  constructor(config: { clientKey: string; clientSecret: string; sandbox: boolean }) {
    this.clientKey = config.clientKey;
    this.clientSecret = config.clientSecret;
    this.endpoint = `https://api.${config.sandbox ? `sandbox.` : ``}lulu.com`;
  }

  public async listPrintJobs(
    ids?: number[],
  ): Promise<[LuluAPI.ListPrintJobsResponse, number]> {
    const route = `print-jobs/${ids ? `?id=${ids.join(`&id=`)}` : ``}`;
    return this.get<LuluAPI.ListPrintJobsResponse>(route);
  }

  public async createPrintJob(
    payload: LuluAPI.CreatePrintJobPayload,
  ): Promise<[LuluAPI.PrintJob, number]> {
    return this.post<LuluAPI.PrintJob>(`print-jobs/`, payload);
  }

  public async printJobCosts(
    payload: LuluAPI.PrintJobCostsPayload,
  ): Promise<[LuluAPI.PrintJobCostsResponse, number]> {
    return this.post<LuluAPI.PrintJobCostsResponse>(
      `print-job-cost-calculations/`,
      payload,
    );
  }

  public async printJobStatus(
    printJobId: number,
  ): Promise<[LuluAPI.PrintJobStatusResponse, number]> {
    return this.get<LuluAPI.PrintJobStatusResponse>(`print-jobs/${printJobId}/status/`);
  }

  private async get<T>(route: string): Promise<[T, number]> {
    !this.accessToken && (await this.auth());
    const res = await fetch(`${this.endpoint}/${route}`, {
      headers: {
        'Cache-Control': `no-cache`,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    const json = await res.json();
    return [json as T, res.status];
  }

  private async post<T>(
    route: string,
    payload: Record<string, any>,
  ): Promise<[T, number]> {
    !this.accessToken && (await this.auth());
    const res = await fetch(`${this.endpoint}/${route}`, {
      method: `POST`,
      headers: {
        'Cache-Control': `no-cache`,
        'Content-Type': `application/json`,
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    return [json as T, res.status];
  }

  private async auth(): Promise<void> {
    const client = new ClientOAuth2({
      clientId: this.clientKey,
      clientSecret: this.clientSecret,
      accessTokenUri: `${this.endpoint}/auth/realms/glasstree/protocol/openid-connect/token`,
    });

    try {
      const { accessToken } = await client.credentials.getToken();
      this.accessToken = accessToken;
    } catch (err) {
      throw new Error(`Error retrieving Lulu auth token`);
    }
  }
}
