import { Lang } from '@friends-library/types';

export class Color {
  public constructor(public hex: string, public rgb: string) {}

  public rgba(num: number): string {
    return this.rgb.replace(')', `, ${String(num)})`).replace(/^rgb/, 'rgba');
  }
}

const gold = new Color('#C18C59', 'rgb(193, 140, 89)');
const black = new Color('#2D2A29', 'rgb(45, 42, 41)');
const grey = new Color('#6B6C6C', 'rgb(107, 108, 108)');
const maroon = new Color('#6C3142', 'rgb(108, 49, 66)');
const blue = new Color('#628C9D', 'rgb(95, 140, 158)');
const green = new Color('#9D9D80', 'rgb(157, 157, 128)');

const sharedColors = {
  maroon,
  gold,
  black,
  green,
  blue,
  grey,
  gray: grey,
  updated: maroon,
  original: green,
  modernized: blue,
};

const en = {
  lang: 'en' as Lang,
  ...sharedColors,
  primary: maroon,
};

const es = {
  lang: 'es' as Lang,
  ...sharedColors,
  primary: gold,
};

export { en, es };

export type Theme = typeof en;
