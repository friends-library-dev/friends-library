// @flow
import CleanCSS from 'clean-css';
import { readFileSync } from 'fs';

const { env: { NODE_ENV } } = process;

export function classes(...args: Array<string | Object>): string {
  return args.join(' ');
}

export function minify(css: string): string {
  return new CleanCSS({}).minify(css).styles;
}

export function stripDataSelectors(css: string): string {
  return css.replace(/,\[data-css-[^{]+{/g, '{');
}

export function appCss(): string {
  return readFileSync('src/components/App.css', 'utf8');
}

export function format(css: string): string {
  if (NODE_ENV !== 'development') {
    return css;
  }
  let beautified = new CleanCSS({ format: 'beautify' }).minify(css).styles;
  beautified = beautified.replace(/\n}/g, "\n}\n");
  return `\n\n${beautified}\n\n`;
}
