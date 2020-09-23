import { Lang } from '@friends-library/types';
import dict from './strings';

let locale: Lang | null = null;

export function t(strings: TemplateStringsArray, ...vars: (string | number)[]): string {
  const string = translate(strings.join(`%s`));
  return string.replace(`%s`, String(vars[0]));
}

export function translate(str: string): string {
  if (!locale) {
    locale = localeFromEnv();
  }

  if (locale === `es`) {
    if (dict[str] !== undefined) {
      return dict[str];
    } else {
      throw new Error(`Missing translation for string: ${str}`);
    }
  }
  return str;
}

export function setLocale(set: Lang): void {
  locale = set;
}

function localeFromEnv(): Lang {
  try {
    if (
      typeof process !== `undefined` &&
      process.env &&
      // !!! keep full, exact token: `process.env.GATSBY_LANG` for Webpack.definePlugin !!!
      process.env.GATSBY_LANG === `es`
    ) {
      return `es`;
    }

    if (typeof window !== `undefined`) {
      return document.documentElement.lang === `es` ? `es` : `en`;
    }
  } catch (err) {
    console.error(`Error determining locale from env`, err);
  }

  return `en`;
}
