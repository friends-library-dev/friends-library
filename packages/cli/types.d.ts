declare module 'pdf-parse' {
  export default function pdf(
    buffer: Buffer,
    options?: { max?: number },
  ): Promise<{
    numpages: number;
    numrender: number;
    version: string;
    text: string;
    info: {
      PDFFormatVersion: string;
      IsAcroFormPresent: boolean;
      IsXFAPresent: boolean;
      Producer: string;
    };
    metadata: any;
  }>;
}
