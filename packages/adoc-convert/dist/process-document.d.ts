import { Asciidoc, Epigraph, DocSection, Notes, AsciidocConversionLog } from '@friends-library/types';
export default function processDocument(adoc: Asciidoc): {
    epigraphs: Epigraph[];
    sections: DocSection[];
    notes: Notes;
    logs: AsciidocConversionLog[];
};
