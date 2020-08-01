declare module 'gmail-send' {
  export interface SendOptions {
    user?: string;
    pass?: string;
    to?: string;
    from?: string;
    replyTo?: string;
    subject?: string;
    text?: string;
    html?: string;
    files?: string | string[];
  }
  export interface SendFn {
    (opts: SendOptions, cb?: (err: object | null, res?: string) => void): void;
  }
  export default function (opts: SendOptions): SendFn;
}

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
