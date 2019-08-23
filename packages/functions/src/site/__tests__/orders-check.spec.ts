import fetch from 'node-fetch';
import mailer from '@sendgrid/mail';
import checkOrders from '../orders-check';
import { find, persistAll } from '../../lib/Order';
import { invokeCb } from './invoke';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(() => Promise.resolve([{ statusCode: 202 }])),
}));

const { default: Order } = jest.requireActual('../../lib/Order');
jest.mock('../../lib/Order', () => ({
  __esModule: true,
  find: jest.fn(),
  persistAll: jest.fn(),
}));
const mockOrder = new Order({ print_job: { id: 123 } });
(<jest.Mock>find).mockResolvedValue([mockOrder]);

const getToken = jest.fn(() => 'oauth-token');
jest.mock('client-oauth2', () => {
  return jest.fn().mockImplementation(() => ({ credentials: { getToken } }));
});

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const mockFetch = <jest.Mock>(<unknown>fetch);
mockFetch.mockResolvedValue(new Response('{"results":[]}'));

describe('checkOrders()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 204 without doing anything when no orders in accepted state', async () => {
    (<jest.Mock>find).mockResolvedValueOnce([]);
    const { res } = await invokeCb(checkOrders, {});
    expect(res.statusCode).toBe(204);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return 500 response if oauth token acquisition fails', async () => {
    getToken.mockImplementationOnce(() => {
      throw new Error('some error');
    });
    const { res, json } = await invokeCb(checkOrders, {});
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe('error_acquiring_oauth_token');
  });

  it('hits lulu api with ids of interesting orders', async () => {
    (<jest.Mock>find).mockResolvedValueOnce([
      new Order({ print_job: { id: 234 } }),
      new Order({ print_job: { id: 456 } }),
    ]);
    await invokeCb(checkOrders, {});
    expect(mockFetch.mock.calls[0][0]).toMatch(/print-jobs\/\?id=234&id=456$/);
  });

  it('returns 500 if bad response from lulu', async () => {
    mockFetch.mockResolvedValueOnce(new Response('', { status: 500 }));
    const { res, json } = await invokeCb(checkOrders, {});
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe('error_retrieving_print_job_data');
  });

  it('sends emails with tracking links', async () => {
    (<jest.Mock>find).mockResolvedValueOnce([
      new Order({ print_job: { id: 123 }, email: 'foo@bar.com' }),
      new Order({ print_job: { id: 234 }, email: 'rofl@lol.com' }),
      new Order({ print_job: { id: 345 }, email: 'not@shipped.com' }),
    ]);

    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 123,
              status: { name: 'SHIPPED' },
              line_items: [
                {
                  tracking_id: '123456',
                  tracking_urls: ['https://track.me/123456'],
                },
              ],
            },
            {
              id: 234,
              status: { name: 'SHIPPED' },
              line_items: [
                {
                  tracking_id: '234567',
                  tracking_urls: ['https://track.me/234567'],
                },
              ],
            },
            {
              id: 345,
              status: { name: 'IN_PRODUCTION' },
              line_items: [],
            },
          ],
        }),
      ),
    );

    const { res } = await invokeCb(checkOrders, {});
    const emails = (<jest.Mock>mailer.send).mock.calls[0][0];
    expect(emails.length).toBe(2);
    expect(emails[0].to).toBe('foo@bar.com');
    expect(emails[0].text).toContain('track.me/123456');
    expect(emails[1].to).toBe('rofl@lol.com');
    expect(emails[1].text).toContain('track.me/234567');
    expect(res.statusCode).toBe(204);
  });

  it('should update order print status to shipped for shipped order', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 123,
              status: { name: 'SHIPPED' },
              line_items: [{ tracking_urls: ['url'] }],
            },
          ],
        }),
      ),
    );
    await invokeCb(checkOrders, {});
    expect(persistAll).toHaveBeenCalledWith([mockOrder]);
    expect(mockOrder.get('print_job.status')).toBe('shipped');
  });

  it('should respond 500 without emailing if updating orders fails', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 123,
              status: { name: 'SHIPPED' },
              line_items: [{ tracking_urls: ['url'] }],
            },
          ],
        }),
      ),
    );
    (<jest.Mock>persistAll).mockImplementationOnce(() => {
      throw new Error('some error');
    });

    const { res, json } = await invokeCb(checkOrders, {});

    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe('error_persisting_updated_orders');
    expect(mailer.send).not.toHaveBeenCalled();
  });
});
