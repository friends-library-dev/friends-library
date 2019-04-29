// @ts-ignore
import Asciidoctor from '@asciidoctor/core';

let instance: any;

export default function() {
  if (!instance) {
    // @ts-ignore
    instance = new Asciidoctor() as any;
  }
  return instance;
}
