/// <reference types="lodash" />
import { Html, DocPrecursor, FileManifest } from '@friends-library/types';
export declare const frontmatter: ((dpc: DocPrecursor) => FileManifest) & import("lodash").MemoizedFunction;
export declare function epigraph({ epigraphs }: DocPrecursor): Html;
export declare function halfTitle(dpc: DocPrecursor): Html;
export declare function copyright(dpc: DocPrecursor): Html;
