import { Handler, APIGatewayEvent } from 'aws-lambda';
import env from '@friends-library/env';
// import { URLSearchParams } from 'url';
// import fetch from 'node-fetch';

const makeSend = require('gmail-send') as any;

interface Headers {
  [k: string]: string;
}

const handler: Handler = async ({ httpMethod, body }: APIGatewayEvent) => {
  if (!['OPTIONS', 'POST'].includes(httpMethod)) {
    return { statusCode: 400 };
  }

  const isDev = process.env.NODE_ENV === 'development';
  const allowedOrigin = isDev ? '*' : 'https://www.zoecostarica.com';
  const headers: Headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': '*',
  };

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  headers['Content-Type'] = 'application/json';
  const params = JSON.parse(body || '');
  const response = makeResponder(headers);

  if (!params['g-recaptcha-response']) {
    return response(false, 'reCAPTCHA es requerido');
  }

  const {
    ZOE_ORDER_EMAIL_USER,
    ZOE_ORDER_EMAIL_PASS,
    ZOE_ORDER_EMAIL_RECIPIENT,
    // ZOE_ORDER_RECAPTCHA_SECRET,
  } = env.require(
    'ZOE_ORDER_EMAIL_USER',
    'ZOE_ORDER_EMAIL_PASS',
    'ZOE_ORDER_EMAIL_RECIPIENT',
    // 'ZOE_ORDER_RECAPTCHA_SECRET',
  );

  // const data = new URLSearchParams();
  // data.append('secret', ZOE_ORDER_RECAPTCHA_SECRET || '');
  // data.append('response', params['g-recaptcha-response']);
  // const { success } = await fetch('https://www.google.com/recaptcha/api/siteverify', {
  //   method: 'post',
  //   body: data,
  // }).then(response => response.json());

  // if (success === false) {
  //   return response(false, 'Google cree que eres un robot');
  // }

  let sendSuccess = false;
  await new Promise(resolve => {
    const sendEmail = makeSend({
      user: ZOE_ORDER_EMAIL_USER,
      pass: ZOE_ORDER_EMAIL_PASS,
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
        subject: `Pedido de Libro -- ${new Date().toLocaleString()}`,
        html,
        to: ZOE_ORDER_EMAIL_RECIPIENT,
      },
      (err: any) => {
        sendSuccess = !err;
        resolve();
      },
    );
  });

  return response(sendSuccess);
};

export { handler };

function makeResponder(
  headers: Headers,
): (
  success: boolean,
  msg?: string,
) => { statusCode: number; headers: Headers; body: string } {
  return (success, msg) => ({
    statusCode: 200,
    headers,
    body: JSON.stringify({ success, ...(msg ? { msg } : {}) }),
  });
}
