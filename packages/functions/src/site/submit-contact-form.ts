import { APIGatewayEvent } from 'aws-lambda';
import { checkoutErrors as Err, Lang } from '@friends-library/types';
import mailer from '@sendgrid/mail';
import env from '@friends-library/env';
import Responder from '../lib/Responder';
import validateJson from '../lib/validate-json';
import { emailFrom } from '../lib/email';
import log from '../lib/log';

export default async function submitContactForm(
  { body }: APIGatewayEvent,
  respond: Responder,
): Promise<void> {
  const data = validateJson<typeof schema.example>(body, schema);
  if (data instanceof Error) {
    log.error('invalid body for POST /contact', { body: body, error: data });
    return respond.json({ msg: Err.INVALID_FN_REQUEST_BODY }, 400);
  }

  const { SENDGRID_API_KEY } = env.require('SENDGRID_API_KEY');
  mailer.setApiKey(SENDGRID_API_KEY);
  const [res] = await mailer.send({
    to: emailTo(data),
    from: emailFrom(data.lang),
    replyTo: `${data.name} <${data.email}>`,
    subject: `${
      data.lang === 'en'
        ? 'friendslibrary.com contact form'
        : 'bibliotecadelosamigos.org formulario de contacto'
    } -- ${new Date().toLocaleString()}`,
    text: emailText(data),
    mailSettings: {
      sandboxMode: {
        enable: process.env.NODE_ENV !== 'production',
      },
    },
  });

  if (res.statusCode > 202) {
    return respond.json({ msg: Err.ERROR_SENDING_EMAIL }, 500);
  }

  respond.noContent();
}

function emailText({ name, subject, message }: typeof schema.example): string {
  return [
    `Name: ${name}`,
    subject === 'tech' ? 'Type: Website / technical question' : false,
    `Message: ${message}`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

function emailTo({ subject, message, lang }: typeof schema.example): string {
  const { JASON_CONTACT_FORM_EMAIL, JARED_CONTACT_FORM_EMAIL } = env.require(
    'JASON_CONTACT_FORM_EMAIL',
    'JARED_CONTACT_FORM_EMAIL',
  );

  if (lang === 'es') {
    return JASON_CONTACT_FORM_EMAIL;
  }

  if (message.toLocaleLowerCase().match(/\bjason\b/)) {
    return JASON_CONTACT_FORM_EMAIL;
  }

  if (message.toLocaleLowerCase().match(/\bjared\b/)) {
    return JARED_CONTACT_FORM_EMAIL;
  }

  if (subject === 'tech') {
    return JARED_CONTACT_FORM_EMAIL;
  }

  return Math.random() < 0.5 ? JARED_CONTACT_FORM_EMAIL : JASON_CONTACT_FORM_EMAIL;
}

const schema = {
  properties: {
    lang: { type: 'string', enum: ['en', 'es'] },
    name: { type: 'string' },
    email: { $ref: '/email' },
    subject: { type: 'string', enum: ['tech', 'other'] },
    message: { type: 'string' },
  },
  example: {
    lang: 'en' as Lang,
    name: 'John Doe',
    email: 'you@example.com',
    subject: 'tech' as 'tech' | 'other',
    message: 'Having trouble with audiobooks.',
  },
};
