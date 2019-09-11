import { Lang, Html } from '@friends-library/types';
export declare function makeReduceWrapper(before: string, after: string): (acc: string[], str: string, index: number, array: string[]) => string[];
export declare const br7 = "<br class=\"m7\"/>";
export declare function ucfirst(lower: string): string;
export declare function capitalizeTitle(str: string, lang: Lang): string;
export declare function trimTrailingPunctuation(str: string): string;
export declare function removeMobi7Tags(html: Html): Html;
