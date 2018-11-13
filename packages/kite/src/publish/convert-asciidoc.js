// @flow
import Asciidoctor from 'asciidoctor.js';
import chalk from 'chalk';
import type { Asciidoc, Html } from '../../../../type';

const asciidoctor = new Asciidoctor();

export function convertAsciidoc(adoc: Asciidoc): Html {
  const memoryLogger = asciidoctor.MemoryLogger.$new();
  asciidoctor.LoggerManager.setLogger(memoryLogger);

  const html = asciidoctor.convert(adoc);
  const logs = memoryLogger.getMessages();

  if (!logs.length) {
    return html;
  }

  const messages = logs.map(log => {
    const msg = log.getText();
    if (msg === 'unterminated open block') {
      return `${msg}: you probably forgot to close out an [.embedded-content-document]`;
    }
    return `${log.getSeverity()} ${msg}`;
  });

  throw new Error(chalk.red(messages.join('\n')));
}
