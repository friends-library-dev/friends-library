import { PrintSize, PrintSizeDetails } from '@friends-library/types';
export declare const sizes: {
    [K in PrintSize]: PrintSizeDetails;
};
export declare function choosePrintSize(pages: {
    s: number;
    m: number;
}): PrintSize;
export declare function getPrintSizeDetails(id: string): PrintSizeDetails;
