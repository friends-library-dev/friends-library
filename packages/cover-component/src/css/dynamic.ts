import { Css } from '@friends-library/types';
import common from './common';
import front from './front';
import back from './back';
import spine from './spine';
import threeD from './3d';

export default function allDynamic(scaler?: number, scope?: string): Css {
  return [
    common(scaler, scope)[1],
    front(scaler, scope)[1],
    back(scaler, scope)[1],
    spine(scaler, scope)[1],
    threeD(scaler, scope)[1],
  ].join('');
}
