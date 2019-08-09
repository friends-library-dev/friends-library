import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered/react';
import { useEnglish, useSpanish } from './locale';
import Nav from '../src/Nav';
import Search from '../src/Search';
import Button from '../src/Button';

storiesOf('Button', module).add('primary + secondary', () => (
  <>
    <Button>Primary</Button>
    <Button secondary>Secondary</Button>
  </>
));

storiesOf('Nav (en)', module)
  .addDecorator(useEnglish)
  .add('default', () => (
    <Nav menuOpen={false} onHamburgerClick={a('hamburger clicked')} />
  ))
  .add('searching', () => (
    <Nav
      menuOpen={false}
      initialSearching={true}
      onHamburgerClick={a('hamburger clicked')}
    />
  ));

storiesOf('Nav (es)', module)
  .addDecorator(useSpanish)
  .add('default', () => (
    <Nav menuOpen={false} onHamburgerClick={a('hamburger clicked')} />
  ))
  .add('searching', () => (
    <Nav
      menuOpen={false}
      initialSearching={true}
      onHamburgerClick={a('hamburger clicked')}
    />
  ));

storiesOf('Search', module)
  .addDecorator(useEnglish)
  .addDecorator(centered)
  .add('minimized', () => <Search expanded={false} {...searchActions} />)
  .add('expanded', () => <Search expanded={true} {...searchActions} />)
  .add('with text', () => (
    <Search value="William Penn" expanded={true} {...searchActions} />
  ));

const searchActions = {
  onClick: a('click'),
  onBlur: a('blur'),
};
