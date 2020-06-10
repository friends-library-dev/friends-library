import tailwind from '../../tailwind.config';

export function bgLayer(
  color: string | [number, number, number],
  opacity?: number,
): string {
  let colorStr = ``;
  if (typeof color === `string`) {
    colorStr = color;
    const tailwindColors = tailwind.theme.extend.colors;
    if (color in tailwindColors) {
      colorStr = tailwindColors[color as keyof typeof tailwindColors];
    }
  } else {
    colorStr = `rgb(${color.join(`, `)})`;
  }
  if (opacity) {
    colorStr = colorStr.replace(`)`, `, ${opacity})`).replace(`rgb(`, `rgba(`);
  }

  return `linear-gradient(${colorStr}, ${colorStr})`;
}
