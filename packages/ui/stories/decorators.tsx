import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import {
  CoverWebStylesAllStatic,
  CoverWebStylesSizes,
} from '@friends-library/cover-component';
import { useLocale } from '../src/translation';
import { es, en } from '../src/theme';

export function useEnglish(storyFn: any): JSX.Element {
  useLocale('en');
  return <ThemeProvider theme={en}>{storyFn()}</ThemeProvider>;
}

export function useSpanish(storyFn: any): JSX.Element {
  useLocale('es');
  return <ThemeProvider theme={es}>{storyFn()}</ThemeProvider>;
}

export function coverSizes(storyFn: any): JSX.Element {
  return (
    <>
      {storyFn()}
      <CoverWebStylesAllStatic />
      <CoverWebStylesSizes />
    </>
  );
}
