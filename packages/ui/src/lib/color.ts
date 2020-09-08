import { LANG } from '../env';

export function bgLayer(
  color: string | [number, number, number],
  opacity?: number,
): string {
  let colorStr = ``;
  if (typeof color === `string`) {
    switch (color) {
      case `flprimary`:
        colorStr = LANG === `en` ? `rgb(108, 49, 66)` : `rgb(193, 140, 89)`;
        break;
      case `flblue`:
        colorStr = `rgb(95, 140, 158)`;
        break;
      case `black`:
        colorStr = `rgb(0, 0, 0)`;
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
