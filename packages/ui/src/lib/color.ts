import tailwind from '../../tailwind.config';

export function bgLayer(
  color: string | [number, number, number],
  opacity?: number,
): string {
  let colorStr = ``;
  if (typeof color === `string`) {
    colorStr = color;
    if (tailwind.theme.extend.colors.hasOwnProperty(color)) {
      // @ts-ignore
      colorStr = tailwind.theme.extend.colors[color] as string;
    }
  } else {
    colorStr = `rgb(${color.join(`, `)})`;
  }
  if (opacity) {
    colorStr = colorStr.replace(`)`, `, ${opacity})`);
  }

  return `linear-gradient(${colorStr}, ${colorStr})`;
}
