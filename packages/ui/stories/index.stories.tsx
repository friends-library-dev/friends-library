import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Nav from '../src/Nav';
import Search from '../src/Search';
import centered from '@storybook/addon-centered/react';

storiesOf('Nav', module)
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
