import { Css } from '@friends-library/types';
import common from './common';
import front from './front';
import back from './back';
import spine from './spine';
import guides from './guides';
import threeD from './3d';
import pdf from './pdf';

export default function allStatic(withGuides?: boolean): Css {
  return [
    common()[0],
    front()[0],
    back()[0],
    spine()[0],
    threeD()[0],
    ...(withGuides ? [guides()[0]] : []),
    pdf({ size: `m`, pages: 222 }),
  ].join(``);
}
