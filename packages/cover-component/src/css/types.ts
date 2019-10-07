import { CoverProps, Css } from '@friends-library/types';

export interface CoverCssModule {
  (
    props: Pick<CoverProps, 'size' | 'pages' | 'author'>,
    scaler?: number,
    scope?: string,
  ): [Css, Css];
}
