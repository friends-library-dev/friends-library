import { Asciidoc, DocSection } from '@friends-library/types';
export declare function extractShortHeadings(adoc: Asciidoc): Map<string, string>;
export declare function extractHeading(section: Omit<DocSection, 'heading'>, short: Map<string, string>): DocSection;
