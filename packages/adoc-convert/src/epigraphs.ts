import { Asciidoc, Epigraph } from '@friends-library/types';

export function extractEpigraphs(adoc: Asciidoc): [Epigraph[], Asciidoc] {
  const epigraphs: Epigraph[] = [];
  const shortened = adoc.replace(
    /\[quote\.epigraph(?:, *, *([^\]]+?))?\]\n____+\n([\s\S]+?)\n____+/gim,
    (_, source, text) => {
      epigraphs.push({ text, ...(source ? { source } : {}) });
      return ``;
    },
  );
  return [epigraphs, shortened.trimLeft()];
}
