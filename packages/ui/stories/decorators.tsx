import React from 'react';
import { StoryDecorator } from '@storybook/react';
import { ThemeProvider } from 'emotion-theming';
import {
  CoverWebStylesAllStatic,
  CoverWebStylesSizes,
} from '@friends-library/cover-component';
import { useLocale } from '../src/translation';
import { es, en } from '../src/theme';

const useEnglish: StoryDecorator = storyFn => {
  useLocale('en');
  return <ThemeProvider theme={en}>{storyFn()}</ThemeProvider>;
};

const useSpanish: StoryDecorator = storyFn => {
  useLocale('es');
  return <ThemeProvider theme={es}>{storyFn()}</ThemeProvider>;
};

const coverSizes: StoryDecorator = storyFn => (
  <>
    {storyFn()}
    <CoverWebStylesAllStatic />
    <CoverWebStylesSizes />
  </>
);

export { useSpanish, useEnglish, coverSizes };
