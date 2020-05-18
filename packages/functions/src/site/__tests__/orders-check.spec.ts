import { checkoutErrors as Err } from '@friends-library/types';
import fetch from 'node-fetch';
import mailer from '@sendgrid/mail';
import checkOrders from '../orders-check';
import { findByPrintJobStatus, saveAll } from '../../lib/order';
import { invokeCb } from './invoke';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(() => Promise.resolve([{ statusCode: 202 }])),
}));

jest.mock('../../lib/order', () => ({
  findByPrintJobStatus: jest.fn(() =>
    Promise.resolve([null, [{ printJobId: 123, address: { name: 'Bo' } }]]),
  ),
  saveAll: jest.fn(() => Promise.resolve([null, true])),
}));

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

  it('returns 200 w/ message without doing anything when no orders in accepted state', async () => {
    (<jest.Mock>findByPrintJobStatus).mockResolvedValueOnce([null, []]);
    const { res, json } = await invokeCb(checkOrders, {});
    expect(res.statusCode).toBe(200);
    expect(json).toMatchObject({ msg: 'No accepted print jobs to process' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return 500 response if oauth token acquisition fails', async () => {
    getToken.mockImplementationOnce(() => {
      throw new Error('some error');
    });
    const { res, json } = await invokeCb(checkOrders, {});
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe(Err.ERROR_ACQUIRING_LULU_OAUTH_TOKEN);
  });

  it('hits lulu api with ids of interesting orders', async () => {
    (<jest.Mock>findByPrintJobStatus).mockResolvedValueOnce([
      null,
      [{ printJobId: 234 }, { printJobId: 456 }],
    ]);
    await invokeCb(checkOrders, {});
    expect(mockFetch.mock.calls[0][0]).toMatch(/print-jobs\/\?id=234&id=456$/);
  });

  it('returns 500 if bad response from lulu', async () => {
    mockFetch.mockResolvedValueOnce(new Response('', { status: 500 }));
    const { res, json } = await invokeCb(checkOrders, {});
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe(Err.ERROR_RETRIEVING_PRINT_JOB_DATA);
  });

  it('does not try to send empty email list', async () => {
    (<jest.Mock>findByPrintJobStatus).mockResolvedValueOnce([
      null,
      [{ printJobId: 123, email: 'foo@bar.com' }],
    ]);
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 123,
              status: { name: 'IN_PRODUCTION' },
              line_items: [],
            },
          ],
        }),
      ),
    );
    await invokeCb(checkOrders, {});
    expect(<jest.Mock>mailer.send).not.toHaveBeenCalled();
  });

  it('sends emails with tracking links', async () => {
    (<jest.Mock>findByPrintJobStatus).mockResolvedValueOnce([
      null,
      [
        {
          printJobId: 123,
          printJobStatus: 'accepted',
          email: 'foo@bar.com',
          address: { name: 'Bo' },
        },
        {
          printJobId: 234,
          printJobStatus: 'accepted',
          email: 'rofl@lol.com',
          address: { name: 'Bo' },
        },
        {
          printJobId: 345,
          printJobStatus: 'accepted',
          email: 'not@shipped.com',
          address: { name: 'Bo' },
        },
      ],
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
    expect(findByPrintJobStatus).toHaveBeenCalledWith('accepted');
    expect(emails.length).toBe(2);
    expect(emails[0].to).toBe('foo@bar.com');
    expect(emails[0].text).toContain('track.me/123456');
    expect(emails[1].to).toBe('rofl@lol.com');
    expect(emails[1].text).toContain('track.me/234567');
    expect(res.statusCode).toBe(200);
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
    expect((<jest.Mock>saveAll).mock.calls[0][0]).toMatchObject([
      { printJobStatus: 'shipped' },
    ]);
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
    (<jest.Mock>saveAll).mockResolvedValueOnce([['error'], null]);

    const { res, json } = await invokeCb(checkOrders, {});

    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe(Err.ERROR_UPDATING_FLP_ORDERS);
    expect(mailer.send).not.toHaveBeenCalled();
  });
});
