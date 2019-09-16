import { DocPrecursor, PaperbackInteriorConfig, Css, PrintSizeDetails } from '@friends-library/types';
export declare function paperbackInterior(dpc: DocPrecursor, conf: PaperbackInteriorConfig): Css;
export declare function printDims(size: PrintSizeDetails): {
    [key: string]: string;
};
