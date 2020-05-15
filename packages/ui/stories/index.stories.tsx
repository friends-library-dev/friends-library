import React from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered/react';
import { coverSizes } from './decorators';
import Nav from '../src/Nav';
import Button from '../src/Button';
import Hamburger from '../src/Hamburger';
import SlideoverMenu from '../src/SlideoverMenu';
import Footer from '../src/Footer';
import MultiPill from '../src/MultiPill';
import HomeHeroBlock from '../src/pages/home/HeroBlock';
import HomeFeaturedBooksBlock from '../src/pages/home/FeaturedBooksBlock';
import HomeWhoWereTheQuakersBlock from '../src/pages/home/WhoWereTheQuakersBlock';

// @ts-ignore
import Mountains from '../src/images/mountains.jpg';
// @ts-ignore
import London from '../src/images/london.jpg';

storiesOf('Footer', module).add('default', () => (
  <Footer
    bgImg={{
      aspectRatio: 1,
      src: Mountains,
      srcSet: '',
    }}
  />
));

storiesOf('SlideoverMenu', module).add('default', () => (
  <SlideoverMenu onClose={a('close')} />
));

storiesOf('Hamburger', module)
  .addDecorator(centered)
  .add('default', () => <Hamburger onClick={a('hamburger-clicked')} />);

storiesOf('Button', module)
  .addDecorator(centered)
  .add('various', () => (
    <>
      <Button className="mb-6" shadow bg="gold">
        Shadow
      </Button>
      <Button className="mb-6">Click Me</Button>
      <Button className="mb-6 border-4 border-green-300">With Border</Button>
      <Button bg={null} className="bg-red-500 mb-6">
        Custom BG
      </Button>
      <Button className="mb-6" bg="blue">
        Find out more
      </Button>
      <Button disabled className="mb-6">
        disabled
      </Button>
      <Button to="/" bg="green">
        Secondary
      </Button>
    </>
  ));

storiesOf('Nav', module)
  .add('default', () => (
    <Nav
      showCartBadge={false}
      onCartBadgeClick={a('cart badge clicked')}
      onHamburgerClick={a('hamburger clicked')}
    />
  ))
  .add('with cart badge', () => (
    <Nav
      showCartBadge
      onCartBadgeClick={a('cart badge clicked')}
      onHamburgerClick={a('hamburger clicked')}
    />
  ))
  .add('searching', () => (
    <Nav
      initialSearching={true}
      showCartBadge={false}
      onCartBadgeClick={a('cart badge clicked')}
      onHamburgerClick={a('hamburger clicked')}
    />
  ));

storiesOf('Home Blocks', module)
  .addDecorator(coverSizes)
  .add('Who Were Quakers?', () => (
    <HomeWhoWereTheQuakersBlock bgImg={{ aspectRatio: 1, src: London, srcSet: '' }} />
  ))
  .add('Featured Books', () => <HomeFeaturedBooksBlock books={[]} />)
  .add('Hero', () => <HomeHeroBlock />);

storiesOf('MultiPill', module)
  .addDecorator(storyFn => (
    <div style={{ maxWidth: 1000, padding: '3em' }}>{storyFn()}</div>
  ))
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
