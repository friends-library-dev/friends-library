import { Lang, Html } from '@friends-library/types';
export declare const br7 = "<br class=\"m7\"/>";
export declare function ucfirst(lower: string): string;
export declare function capitalizeTitle(str: string, lang: Lang): string;
export declare function trimTrailingPunctuation(str: string): string;
export declare function removeMobi7Tags(html: Html): Html;
export declare function wrapHtmlBody(bodyHtml: Html, opts?: {
    css?: string[];
    title?: string;
    bodyClass?: string;
}): Html;
