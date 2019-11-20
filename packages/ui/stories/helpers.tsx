import { css as coverCss } from '@friends-library/cover-component';
import { Css } from '@friends-library/types';

export function addStaticCoverCss(extraCss?: Css): void {
  const prev = document.getElementById('cover-static-css');
  prev && prev.remove();
  const style = document.createElement('style');
  style.id = 'cover-static-css';
  style.type = 'text/css';
  const staticCss = `${coverCss.allStatic(true)}${extraCss || ''}`;
  style.appendChild(document.createTextNode(staticCss));
  document.getElementsByTagName('head')[0].appendChild(style);
}
