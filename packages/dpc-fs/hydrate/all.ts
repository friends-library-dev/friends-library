import FsDocPrecursor from '../FsDocPrecursor';
import meta from './meta';
import revision from './revision';
import config from './config';
import customCode from './custom-code';
import asciidoc from './asciidoc';
import process from './process';

export default function all(dpcs: FsDocPrecursor[], isolate?: number): void {
  dpcs.forEach(meta);
  dpcs.forEach(revision);
  dpcs.forEach(config);
  dpcs.forEach(customCode);
  dpcs.forEach((dpc) => asciidoc(dpc, isolate || undefined));
  dpcs.forEach(process);
}
