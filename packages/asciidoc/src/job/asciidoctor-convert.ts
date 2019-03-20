import { Asciidoc, Html } from '@friends-library/types';
import asciidoctor from './asciidoctor';

interface Log {
  getText(): string;
  getSeverity(): string;
}

export default function convertAsciidoc(adoc: Asciidoc): [Html, Log[]] {
  const memoryLogger = asciidoctor.MemoryLogger.$new();
  asciidoctor.LoggerManager.setLogger(memoryLogger);
  const html = asciidoctor.convert(adoc) as Html;
  const logs = memoryLogger.getMessages() as Log[];
  return [html, logs];
}
