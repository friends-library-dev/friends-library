import stripIndent from 'strip-indent';
import { Html } from '@friends-library/types';

export default function wrapHtmlBody(
  bodyHtml: Html,
  opts: {
    htmlAttrs?: string;
    isUtf8?: boolean;
    css?: string[];
    title?: string;
    bodyClass?: string;
  } = {},
): Html {
  return stripIndent(`
    <!DOCTYPE html>
    <html${opts.htmlAttrs ? ` ${opts.htmlAttrs.trim()}` : ``}>
    <head>
      ${opts.isUtf8 ? `<meta charset="UTF-8"/>` : ``}
      ${opts.title ? `<title>${opts.title}</title>` : ``}
      ${(opts.css || []).map(
        (href) => `<link href="${href}" rel="stylesheet" type="text/css" />`,
      )}
    </head>
    <body${opts.bodyClass ? ` class="${opts.bodyClass}"` : ``}>
      ${bodyHtml.trim()}
    </body>
    </html>
  `).trim();
}
