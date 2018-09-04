// @flow
import type { Asciidoc } from '../type';


export function processAsciidoc(adoc: Asciidoc): Asciidoc {
  return adoc
    .replace(/(?<!footnote:)\[/gm, '+++[+++')
    .replace(/(____*)/g, '+++$1+++');
}
