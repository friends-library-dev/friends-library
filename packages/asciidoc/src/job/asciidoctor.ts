// @ts-ignore
import Asciidoctor from 'asciidoctor.js';

let instance: any;

export default function() {
  if (!instance) {
    // @ts-ignore
    instance = new Asciidoctor() as any;
  }
  return instance;
}
