import { Asciidoc, Html, AsciidocConversionLog } from '@friends-library/types';
import asciidoctor from './asciidoctor';

export default function convertAsciidoc(adoc: Asciidoc): [Html, AsciidocConversionLog[]] {
  console.log('IN HERE!');
  const memoryLogger = asciidoctor().MemoryLogger.$new();
  asciidoctor().LoggerManager.setLogger(memoryLogger);
  const html = asciidoctor().convert(adoc) as Html;
  const logs = memoryLogger.getMessages() as AsciidocConversionLog[];
  return [html, logs];
}
