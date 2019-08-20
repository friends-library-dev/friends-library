import mailer from '@sendgrid/mail';
import sendConfirmation from '../order-send-confirmation-email';
import { invokeCb } from './invoke';
import { findById } from '../../lib/Order';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(() => Promise.resolve([{ statusCode: 202 }])),
}));

const mockOrder = {
  id: '123',
  get: jest.fn(() => 'test@foo.com'),
};
jest.mock('../../lib/Order', () => ({
  __esModule: true,
  default: jest.fn(() => mockOrder),
  findById: jest.fn(() => mockOrder),
}));

describe('sendOrderConfirmationEmail()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return 204 with chargeId if successful', async () => {
    const { res } = await invokeCb(sendConfirmation, {
      path: '/site/order/123/confirmation-email',
    });
    expect(res.statusCode).toBe(204);
  });

  it('should return 500 of sendgrid does not respond 202', async () => {
    (<jest.Mock>mailer.send).mockResolvedValueOnce([{ statusCode: 419 }]);
    const { res, json } = await invokeCb(sendConfirmation, {
      path: '/site/order/123/confirmation-email',
    });
    expect(res.statusCode).toBe(500);
    expect(json.msg).toBe('error_sending_email');
  });

  it('should respond 404 if order cant be found', async () => {
    (<jest.Mock>findById).mockResolvedValueOnce(null);
    const { res, json } = await invokeCb(sendConfirmation, {
      path: '/site/order/123/confirmation-email',
    });
    expect(res.statusCode).toBe(404);
    expect(json.msg).toBe('order_not_found');
    expect(<jest.Mock>findById).toHaveBeenCalledWith('123');
  });

  it('should send custom email data', async () => {
    (<jest.Mock>findById).mockResolvedValueOnce({
      id: '345',
      get: () => 'foo@bar.com',
    });
    await invokeCb(sendConfirmation, {
      path: '/site/order/345/confirmation-email',
    });
    expect((<jest.Mock>mailer.send).mock.calls[0][0].to).toBe('foo@bar.com');
    expect((<jest.Mock>mailer.send).mock.calls[0][0].subject).toContain('345');
    expect((<jest.Mock>mailer.send).mock.calls[0][0].text).toContain('345');
  });
});
