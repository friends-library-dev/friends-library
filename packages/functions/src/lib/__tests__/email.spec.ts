import { Db } from '@friends-library/db';
import { orderShippedEmail, orderConfirmationEmail } from '../email';

describe(`order email functions`, () => {
  let order: Db.Order;

  beforeEach(() => {
    order = {
      lang: `en`,
      address: {
        name: `Bob Villa`,
      },
      items: [
        { title: `Journal of George Fox (original)`, quantity: 1 },
        { title: `Walk in the Spirit`, quantity: 3 },
      ],
    } as Db.Order;
  });

  test(`orderEmailConfirmation() creates correct dynamic email text`, () => {
    const email = orderConfirmationEmail(order);
    expect(email.subject).toBe(`[,] Friends Library Order Confirmation`);
    expect(email.text).toMatch(/^Bob,/);
    expect(email.text).toMatch(/your order id is: [a-z0-9-]+\./);
    expect(email.text).toMatch(`* (1) Journal of George Fox (original)`);
    expect(email.text).toMatch(`* (3) Walk in the Spirit`);
  });

  test(`orderShippedEmail() creates correct dynamic email text`, () => {
    const email = orderShippedEmail(order, `/track.me`);
    expect(email.subject).toBe(`[,] Friends Library Order Shipped`);
    expect(email.text).toMatch(/^Bob,/);
    expect(email.text).toMatch(/Your order \([a-z0-9-]+\) containing/);
    expect(email.text).toMatch(`* (1) Journal of George Fox (original)`);
    expect(email.text).toMatch(`* (3) Walk in the Spirit`);
    expect(email.text).toMatch(`/track.me`);
  });
});
