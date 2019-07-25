import { Lang } from '@friends-library/types';
import spanish from '../es-strings';

let locale: Lang = 'en';

export function t(strings: TemplateStringsArray): string {
  const string = strings.join('');
  if (shouldResolveSpanish()) {
    if (spanish[string] !== undefined) {
      return spanish[string];
    }
  }
  return string;
}

export function useLocale(lang: Lang): void {
  locale = lang;
}

function shouldResolveSpanish(): boolean {
  if (typeof process !== 'undefined' && process.env && process.env.GATSBY_LANG === 'es') {
    return true;
  }

  if (locale === 'es') {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  return document.documentElement.lang === 'es';
}
