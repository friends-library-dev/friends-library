// @flow
import type { Asciidoc } from '../../../../type';


export function processAsciidoc(adoc: Asciidoc): Asciidoc {
  return adoc
    .replace(/(?<!footnote:)\[/gm, '+++[+++')
    .replace(/\n\n(1[678][0-9]{2})\. /gm, '\n\n$1+++.+++ ')
    .replace(/\n\n----*\n\n/gm, '\n\n[.asterism]\n\'\'\'\n\n')
    .replace(/\n\n        /gm, '\n\n') // eslint-disable-line no-irregular-whitespace
    .replace(/(____*)/g, '+++$1+++')
    .replace(/\n\n +(.)/gm, '\n\n$1')
    .replace(/\n([A-Z0-9])\. ([A-Z])/gm, '\n$1+++.+++ $2')
    .replace(/\n\n[0-9]+(\n)?$/g, '\n');
}
