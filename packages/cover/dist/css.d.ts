import { Css } from '@friends-library/types';
import { CoverProps } from './types';
export declare function cssVars(props: CoverProps): Record<string, string>;
export declare function coverCss(props: CoverProps, context: 'pdf' | 'web'): Css;
