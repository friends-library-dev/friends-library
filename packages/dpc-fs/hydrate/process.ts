import { processDocument } from '@friends-library/adoc-convert';
import FsDocPrecursor from '../FsDocPrecursor';

export default function process(dpc: FsDocPrecursor): void {
  const { logs, notes, sections, epigraphs } = processDocument(dpc.asciidoc);
  if (logs.length) {
    logs.forEach(log => console.error(log));
    throw new Error(`Asciidoc conversion error/s, see ^^^`);
  }
  dpc.notes = notes;
  dpc.sections = sections;
  dpc.epigraphs = epigraphs;
}
