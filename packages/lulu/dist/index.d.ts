import { PrintSize, PrintSizeDetails, PageData } from '@friends-library/types';
export declare const sizes: {
    [K in PrintSize]: PrintSizeDetails;
};
export declare function getPrintSizeDetails(id: string): PrintSizeDetails;
export declare function choosePrintSize(singlePages: PageData['single'], splitPages: PageData['split']): [PrintSize, boolean];
