// @flow
import makeSend from 'gmail-send';
import moment from 'moment';
import type { Html } from '../../../../type';
import type { Command } from '../type';
import { PUBLISH_DIR } from './file';

const { env: { GMAIL_USER, GMAIL_PASS } } = process;

const sendEmail = makeSend({
  user: GMAIL_USER,
  pass: GMAIL_PASS,
});

export function send(files: Array<Html>, cmd: Command) {
  const time = moment().format('M/D/YY h:mm:ssa');
  sendEmail({
    subject: `[kite.js] test docs @ ${time}`,
    html: `Attached files:<br /><ul>${files.map(f => `<li>${f}</li>`).join('')}</ul>`,
    to: cmd.email || GMAIL_USER,
    files: files.map(f => `${PUBLISH_DIR}/${f}`),
  }, (err) => {
    if (err) console.warn(err);
  });
}
