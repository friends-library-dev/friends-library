import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered/react';
import { ThemeProvider } from 'emotion-theming';
import Nav from '../src/Nav';
import Search from '../src/Search';
import { es, en } from '../src/theme';

storiesOf('Nav (en)', module)
  .addDecorator(storyFn => <ThemeProvider theme={en}>{storyFn()}</ThemeProvider>)
  .add('default', () => (
    <Nav menuOpen={false} onHamburgerClick={action('hamburger clicked')} />
  ))
  .add('searching', () => (
    <Nav
      menuOpen={false}
      initialSearching={true}
      onHamburgerClick={action('hamburger clicked')}
    />
  ));

storiesOf('Nav (es)', module)
  .addDecorator(storyFn => <ThemeProvider theme={es}>{storyFn()}</ThemeProvider>)
  .add('default', () => (
    <Nav menuOpen={false} onHamburgerClick={action('hamburger clicked')} />
  ))
  .add('searching', () => (
    <Nav
      menuOpen={false}
      initialSearching={true}
      onHamburgerClick={action('hamburger clicked')}
    />
  ));

storiesOf('Search', module)
  .addDecorator(storyFn => <ThemeProvider theme={en}>{storyFn()}</ThemeProvider>)
  .addDecorator(centered)
  .add('minimized', () => <Search expanded={false} {...searchActions} />)
  .add('expanded', () => <Search expanded={true} {...searchActions} />)
  .add('with text', () => (
    <Search value="William Penn" expanded={true} {...searchActions} />
  ));

const searchActions = {
  onClick: action('click'),
  onBlur: action('blur'),
};
