declare module 'node-zip' {
  export default class Zip {
    constructor();
    constructor(data: any, opts: { base64: boolean; checkCRC32: boolean });
    file(path: string, content: string | Buffer, options?: Record<string, any>): void;
    generate(opts: { base64?: boolean; compression?: 'DEFLATE' }): any;
  }
}

declare module 'epub-check' {
  export interface Message {
    file: string;
    line: number;
    col: number;
    msg: string;
    type: string;
  }

  export default function epubCheck(
    path: string,
  ): Promise<
    | { pass: true }
    | {
        pass: false;
        messages: Message[];
      }
  >;
}

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
  export default function(opts: SendOptions): SendFn;
}
