import { Asciidoc, Html } from '@friends-library/types';
import { memoize, flow } from 'lodash';
import convertAsciidoc from './asciidoctor-convert';
import { postProcessHtml } from './post-process-html';
import { prepareAsciidoc } from './prepare-adoc';

const adocToHtml: (adoc: Asciidoc) => Html = memoize(
  // prettier-ignore
  flow([
    prepareAsciidoc,
    adoc => convertAsciidoc(adoc)[0],
    postProcessHtml,
  ]),
);

export default adocToHtml;
