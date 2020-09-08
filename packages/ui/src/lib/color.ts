import { MAROON_RGB, GOLD_RGB, BLUE_RGB, BLACK_RGB } from '@friends-library/color';
import { LANG } from '../env';

export function bgLayer(
  color: string | [number, number, number],
  opacity?: number,
): string {
  let colorStr = ``;
  if (typeof color === `string`) {
    switch (color) {
      case `flprimary`:
        colorStr =
          LANG === `en` ? `rgb(${MAROON_RGB.join(`,`)})` : `rgb(${GOLD_RGB.join(`,`)})`;
        break;
      case `flblue`:
        colorStr = `rgb(${BLUE_RGB.join(`,`)})`;
        break;
      case `black`:
        colorStr = `rgb(${BLACK_RGB.join(`,`)})`;
        break;
      default:
        if (color.startsWith(`#`)) {
          colorStr = color;
        } else {
          throw new Error(`Unsupported color string: ${color}`);
        }
    }
  } else {
    colorStr = `rgb(${color.join(`, `)})`;
  }
  if (opacity) {
    colorStr = colorStr.replace(`)`, `, ${opacity})`).replace(`rgb(`, `rgba(`);
  }

  return `linear-gradient(${colorStr}, ${colorStr})`;
}
