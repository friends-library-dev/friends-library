import { SourcePrecursor, SourceSpec } from '@friends-library/types';

export default function createSourceSpec(precursor: SourcePrecursor): SourceSpec {
  return {
    id: precursor.id,
    size: precursor.adoc.length,
    lang: precursor.lang,
    meta: precursor.meta,
    filename: precursor.filename,
    revision: precursor.revision,
    config: precursor.config,
    customCss: precursor.customCss,
    epigraphs: [],
    sections: [],
    notes: new Map(),
  };
}
