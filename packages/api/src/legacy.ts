import { requireEnv } from '@friends-library/types';
import express, { Request, Response } from 'express';
import { URLSearchParams } from 'url';
import makeSend from 'gmail-send';
import moment from 'moment';
import fetch from 'node-fetch';
import cors from 'cors';

const {
  API_ZOE_BOOK_REQUEST_EMAIL_USER,
  API_ZOE_BOOK_REQUEST_EMAIL_PASS,
  API_ZOE_BOOK_REQUEST_EMAIL_RECIPIENT,
  API_ZOE_BOOK_REQUEST_RECAPTCHA_SECRET,
} = requireEnv(
  'API_ZOE_BOOK_REQUEST_EMAIL_USER',
  'API_ZOE_BOOK_REQUEST_EMAIL_PASS',
  'API_ZOE_BOOK_REQUEST_EMAIL_RECIPIENT',
  'API_ZOE_BOOK_REQUEST_RECAPTCHA_SECRET',
);

const app = express();
export default app;

app.options('/zoe-book-request', cors(), (req: Request, res: Response) => {
  res.sendStatus(204);
});

app.post('/zoe-book-request', cors(), handleBookRequest);

async function handleBookRequest(req: Request, res: Response): Promise<void> {
  const params = <{ [k: string]: any }>req.body;
  if (!params['g-recaptcha-response']) {
    res.json({
      success: false,
      msg: 'reCAPTCHA es requerido',
    });
    res.end();
    return;
  }

  const data = new URLSearchParams();
  data.append('secret', API_ZOE_BOOK_REQUEST_RECAPTCHA_SECRET || '');
  data.append('response', params['g-recaptcha-response']);
  const { success } = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'post',
    body: data,
  }).then(response => response.json());

  if (success === false) {
    res.json({
      success: false,
      msg: 'Google cree que eres un robot',
    });
    res.end();
    return;
  }

  let sendSuccess;
  await new Promise(resolve => {
    const sendEmail = makeSend({
      user: API_ZOE_BOOK_REQUEST_EMAIL_USER,
      pass: API_ZOE_BOOK_REQUEST_EMAIL_PASS,
      replyTo: params.email,
    });

    const html = Object.entries(params).reduce((acc, [key, val]) => {
      if (key === 'g-recaptcha-response' || String(val).trim() === '') {
        return acc;
      }
      return `
        ${acc}
        <dl>
          <dt><b>${key.replace(/^\w/, c => c.toUpperCase())}:</b></dt>
          <dd>${String(val)}</dd>
        </dl>`;
    }, '');

    sendEmail(
      {
        subject: `Pedido de Libro -- ${moment().format('M/D/YY h:mm:ssa')}`,
        html,
        to: API_ZOE_BOOK_REQUEST_EMAIL_RECIPIENT,
      },
      (err: any) => {
        sendSuccess = !err;
        resolve();
      },
    );
  });
  res.json({ success: sendSuccess });
  res.end();
}
