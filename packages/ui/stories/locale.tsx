import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { useLocale } from '../src/translation';
import { es, en } from '../src/theme';

export function useEnglish(storyFn: any): React.ReactNode {
  useLocale('en');
  return <ThemeProvider theme={en}>{storyFn()}</ThemeProvider>;
}

export function useSpanish(storyFn: any): React.ReactNode {
  useLocale('es');
  return <ThemeProvider theme={es}>{storyFn()}</ThemeProvider>;
}
