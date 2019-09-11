import { Asciidoc, Html, AsciidocConversionLog as Log } from '@friends-library/types';
declare const adocToHtml: (adoc: Asciidoc) => [Html, Log[]];
export default adocToHtml;
