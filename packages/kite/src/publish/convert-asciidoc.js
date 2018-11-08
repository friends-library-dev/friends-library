// @flow
import Asciidoctor from 'asciidoctor.js';
import chalk from 'chalk';
import type { Asciidoc, Html } from '../../../../type';

const asciidoctor = new Asciidoctor();
const memoryLogger = asciidoctor.MemoryLogger.$new();
asciidoctor.LoggerManager.setLogger(memoryLogger);

export function convertAsciidoc(adoc: Asciidoc): Html {
  const html = asciidoctor.convert(adoc);
  const logs = memoryLogger.getMessages();
  const messages = [];
  if (logs.length) {
    logs.forEach(log => {
      let msg = log.getText();
      if (msg === 'unterminated open block') {
        msg += ': you probably forgot to close out an [.embedded-content-document]';
      } else {
        msg = `${log.getSeverity()} ${msg}`;
      }
      messages.push(msg);
    });
    throw new Error(chalk.red(messages.join('\n')));
  }
  return html;
}
