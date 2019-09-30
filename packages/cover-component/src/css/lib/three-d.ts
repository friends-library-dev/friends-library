import { Css, PrintSize } from '@friends-library/types';
import threeDCssStr from '../3d.css';
import { docDims } from './helpers';

export default function threeDCss(size: PrintSize, pages: number): Css {
  const dims = docDims(size, pages);
  return threeDCssStr(dims);
}
