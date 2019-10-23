import FsDocPrecursor from '../FsDocPrecursor';
import { processDocument } from '@friends-library/adoc-convert';
import meta from './meta';
import revision from './revision';
import config from './config';
import customCode from './custom-code';
import asciidoc from './asciidoc';

export default function all(dpcs: FsDocPrecursor[], isolate?: number): void {
  dpcs.forEach(meta);
  dpcs.forEach(revision);
  dpcs.forEach(config);
  dpcs.forEach(customCode);
  dpcs.forEach(dpc => asciidoc(dpc, isolate || undefined));

  dpcs.forEach(dpc => {
    const { logs, notes, sections, epigraphs } = processDocument(dpc.asciidoc);
    if (logs.length) {
      console.error(logs);
      throw new Error('Asciidoc conversion error/s, see ^^^');
    }
    dpc.notes = notes;
    dpc.sections = sections;
    dpc.epigraphs = epigraphs;
  });
}
