import { Asciidoc, Html, AsciidocConversionLog as Log } from '@friends-library/types';
import { memoize } from 'lodash';
import convertAsciidoc from './asciidoctor-convert';
import { postProcessHtml } from './post-process-html';
import { prepareAsciidoc } from './prepare-adoc';

const adocToHtml: (adoc: Asciidoc) => [Html, Log[]] = memoize(
  (adoc: Asciidoc): [Html, Log[]] => {
    const prepared = prepareAsciidoc(adoc);
    const [html, logs] = convertAsciidoc(prepared);
    return [postProcessHtml(html), logs];
  },
);

export default adocToHtml;
