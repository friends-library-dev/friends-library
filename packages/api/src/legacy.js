// @flow
import express, { type $Request, type $Response } from 'express';
import { URLSearchParams } from 'url';
import makeSend from 'gmail-send';
import moment from 'moment';
import fetch from 'node-fetch';
import cors from 'cors';

const { env: {
  API_ZOE_BOOK_REQUEST_EMAIL_USER,
  API_ZOE_BOOK_REQUEST_EMAIL_PASS,
  API_ZOE_BOOK_REQUEST_EMAIL_RECIPIENT,
  API_ZOE_BOOK_REQUEST_RECAPTCHA_SECRET,
} } = process;

const app = express();
export default app;

app.options('/zoe-book-request', cors(), (req: $Request, res: $Response) => {
  res.sendStatus(204);
});

app.post('/zoe-book-request', cors(), handleBookRequest);


async function handleBookRequest(
  req: $Request,
  res: $Response,
) {
  const params = ((req.body: any): Object);
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
  await new Promise((resolve) => {
    const time = moment().format('M/D/YY h:mm:ssa');
    const sendEmail = makeSend({
      user: API_ZOE_BOOK_REQUEST_EMAIL_USER,
      pass: API_ZOE_BOOK_REQUEST_EMAIL_PASS,
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
    sendEmail({
      subject: `Pedido de Libro -- ${time}`,
      html,
      to: API_ZOE_BOOK_REQUEST_EMAIL_RECIPIENT,
    }, (err) => {
      sendSuccess = !err;
      resolve();
    });
  });
  res.json({ success: sendSuccess });
  res.end();
}
