import makeSend from 'gmail-send';
import moment from 'moment';
import { Html, requireEnv } from '@friends-library/types';
import { PUBLISH_DIR } from '../../publish/file';

export function send(files: Html[], email?: string): void {
  const { KITE_GMAIL_USER, KITE_GMAIL_PASS } = requireEnv(
    'KITE_GMAIL_USER',
    'KITE_GMAIL_PASS',
  );

  const sendEmail = makeSend({
    user: KITE_GMAIL_USER,
    pass: KITE_GMAIL_PASS,
  });

  const time = moment().format('M/D/YY h:mm:ssa');

  sendEmail(
    {
      subject: `[kite.js] test docs @ ${time}`,
      html: `Attached files:<br /><ul>${files.map(f => `<li>${f}</li>`).join('')}</ul>`,
      to: email || KITE_GMAIL_USER,
      files: files.map(f => `${PUBLISH_DIR}/${f}`),
    },
    err => {
      if (err) console.warn(err);
    },
  );
}
