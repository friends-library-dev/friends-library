import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered/react';
import { useEnglish, useSpanish, coverSizes } from './decorators';
import Nav from '../src/Nav';
import Search from '../src/Search';
import Button from '../src/Button';
import Hamburger from '../src/Hamburger';
import SlideoverMenu from '../src/SlideoverMenu';
import Hero from '../src/blocks/Hero';
import FeaturedBooks from '../src/blocks/FeaturedBooks';
import Footer from '../src/Footer';
import MultiPill from '../src/MultiPill';
import WhoWereTheQuakers from '../src/blocks/WhoWereTheQuakers';

storiesOf('Footer', module).add('default', () => <Footer />);

storiesOf('SlideoverMenu', module).add('default', () => (
  <SlideoverMenu onClose={a('close')} />
));

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
    <Nav
      showCartBadge={false}
      onCartBadgeClick={a('cart badge clicked')}
      menuOpen={false}
      onHamburgerClick={a('hamburger clicked')}
    />
  ))
  .add('with cart badge', () => (
    <Nav
      showCartBadge
      onCartBadgeClick={a('cart badge clicked')}
      menuOpen={false}
      onHamburgerClick={a('hamburger clicked')}
    />
  ))
  .add('searching', () => (
    <Nav
      menuOpen={false}
      initialSearching={true}
      showCartBadge={false}
      onCartBadgeClick={a('cart badge clicked')}
      onHamburgerClick={a('hamburger clicked')}
    />
  ));

storiesOf('Nav (es)', module)
  .addDecorator(useSpanish)
  .add('default', () => (
    <Nav
      menuOpen={false}
      showCartBadge={false}
      onCartBadgeClick={a('cart badge clicked')}
      onHamburgerClick={a('hamburger clicked')}
    />
  ))
  .add('searching', () => (
    <Nav
      menuOpen={false}
      showCartBadge={false}
      onCartBadgeClick={a('cart badge clicked')}
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
    <Search initialValue="William Penn" expanded={true} {...searchActions} />
  ));

storiesOf('Home Blocks', module)
  .addDecorator(coverSizes)
  .add('Who Were Quakers?', () => <WhoWereTheQuakers />)
  .add('Featured Books', () => <FeaturedBooks />)
  .add('Hero', () => <Hero />);

const searchActions = {
  onSubmit: a('submit'),
  onClick: a('click'),
  onBlur: a('blur'),
};

storiesOf('MultiPill', module)
  .addDecorator(centered)
  .add('3-part', () => (
    <MultiPill
      buttons={[
        { text: 'Download', icon: 'cloud-download' },
        { text: 'Paperback $4.99', icon: 'book' },
        { text: 'Audio Book', icon: 'headphones' },
      ]}
    />
  ))
  .add('2-part', () => (
    <MultiPill buttons={[{ text: 'Download Lo-Fi' }, { text: 'Download Hi-Fi' }]} />
  ));
