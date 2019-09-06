import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered/react';
import { useEnglish, useSpanish } from './locale';
import Nav from '../src/Nav';
import Search from '../src/Search';
import Button from '../src/Button';
import Hamburger from '../src/Hamburger';
import Slideover from '../src/Slideover';
import Hero from '../src/blocks/Hero';
import Footer from '../src/Footer';
import WhoWereTheQuakers from '../src/blocks/WhoWereTheQuakers';

storiesOf('Footer', module).add('default', () => <Footer />);

storiesOf('Slideover', module).add('default', () => <Slideover />);

storiesOf('Hamburger', module)
  .addDecorator(centered)
  .add('default', () => <Hamburger menuOpen={false} onClick={a('hamburger-clicked')} />);

storiesOf('Button', module)
  .addDecorator(centered)
  .add('primary + secondary', () => (
    <>
      <Button className="mb-6 bg-flblue">Find out more</Button>
      <Button className="bg-flmaroon">Secondary</Button>
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

storiesOf('Blocks', module)
  .add('Who Were Quakers?', () => <WhoWereTheQuakers />)
  .add('Hero', () => <Hero />);

const searchActions = {
  onClick: a('click'),
  onBlur: a('blur'),
};
