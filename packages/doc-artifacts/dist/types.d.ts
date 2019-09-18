export interface Options {
    namespace?: string;
    srcPath?: string;
}
export declare type PdfOptions = Options & {
    formatOutput?: (line: string) => string;
};
export declare type EbookOptions = Options & {
    check: boolean;
};
