import { Css } from '@friends-library/types';

export interface CoverCssModule {
  (scaler?: number, scope?: string): [Css, Css];
}
