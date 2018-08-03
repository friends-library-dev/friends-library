// @flow
import makeSend from 'gmail-send';
import moment from 'moment';
import type { Command, Html } from '../type';

const { env: { GMAIL_USER, GMAIL_PASS } } = process;

const sendEmail = makeSend({
  user: GMAIL_USER,
  pass: GMAIL_PASS,
});

export function send(files: Array<*>, cmd: Command) {
  const time = moment().format('M/D/YY h:mm:ssa');
  sendEmail({
    subject: `[kite.js] test docs @ ${time}`,
    html: `Attached files:<br /><ul>${files.map(f => `<li>${f}</li>`).join('')}</ul>`,
    to: cmd.email || GMAIL_USER,
    files: files.map(f => `_publish/${f}`),
  }, (err, res) => {
    if (err) return console.warn(err);
  });
}
