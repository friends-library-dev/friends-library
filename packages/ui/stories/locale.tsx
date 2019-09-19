import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { useLocale } from '../src/translation';
import { es, en } from '../src/theme';

const useEnglish = (storyFn: any) => {
  useLocale('en');
  return <ThemeProvider theme={en}>{storyFn()}</ThemeProvider>;
};

const useSpanish = (storyFn: any) => {
  useLocale('es');
  return <ThemeProvider theme={es}>{storyFn()}</ThemeProvider>;
};

export { useSpanish, useEnglish };
