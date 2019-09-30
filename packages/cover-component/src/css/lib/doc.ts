import { Css, PrintSize } from '@friends-library/types';
import { docDims } from './helpers';
import docCssStr from '../doc.css';

export default function docCss(size: PrintSize, pages: number): Css {
  const dims = docDims(size, pages);
  return docCssStr(dims);
}
