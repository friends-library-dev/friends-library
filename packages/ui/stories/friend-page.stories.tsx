import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered/react';
import { coverSizes } from './decorators';
import Quotes from '../src/pages/friend/Quotes';
import FeaturedQuoteBlock from '../src/pages/friend/FeaturedQuoteBlock';
import FriendBlock from '../src/pages/friend/FriendBlock';
import BookByFriend from '../src/pages/friend/BookByFriend';
import FriendMeta from '../src/pages/friend/FriendMeta';
import Testimonial from '../src/pages/friend/Testimonial';
import TestimonialsBlock from '../src/pages/friend/TestimonialsBlock';
import MapBlock from '../src/pages/friend/MapBlock';
import AudioIcon from '../src/icons/Audio';
import TagsIcon from '../src/icons/Tags';
import ClockIcon from '../src/icons/Clock';
import DownloadIcon from '../src/icons/Download';
import { props as coverProps } from './cover.stories';

storiesOf('Friend Page', module)
  .addDecorator(centered)
  .add('Quote svg', () => <Quotes />)
  .add('Audio icon svg', () => <AudioIcon />)
  .add('Tags icon svg', () => <TagsIcon />)
  .add('Clock icon svg', () => <ClockIcon />)
  .add('Download icon svg', () => <DownloadIcon />)
  .add('Testimonial', () => (
    <Testimonial
      className="w-64"
      color="green"
      quote={LOREM}
      cite="George Fox"
    ></Testimonial>
  ))
  .add('FriendMeta', () => (
    <FriendMeta className="w-64" color="green" title="Author Facts">
      <li>Lived: 1808</li>
      <li>Died: 1891</li>
      <li>
        City: <a href="/">London</a>
      </li>
      <li>Foobar: This is pretty long lol rofl</li>
      <li>Country: Great Britain</li>
      <li>Role: Elder</li>
    </FriendMeta>
  ));

storiesOf('Friend page', module)
  .addDecorator(coverSizes)
  .add('FriendBlock', () => (
    <FriendBlock gender="female" name="Ann Branson" blurb={blurb} />
  ))
  .add('FeaturedQuoteBlock', () => (
    <FeaturedQuoteBlock cite="Ann Branson" quote={quote} />
  ))
  .add('BookByFriend', () => (
    <div className="bg-flgray-100 p-12 flex flex-col items-center">
      <BookByFriend
        isAlone={true}
        htmlShortTitle={coverProps.title}
        {...coverProps}
        bookUrl="/"
        tags={['journal', 'letters']}
        hasAudio
        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        pages={[187]}
      />
    </div>
  ));

storiesOf('Friend page/TestimonialsBlock', module)
  .add('one', () => (
    <TestimonialsBlock
      testimonials={[
        {
          quote: LOREM,
          cite: 'George Fox',
        },
      ]}
    />
  ))
  .add('two', () => (
    <TestimonialsBlock
      testimonials={[
        {
          quote: LOREM,
          cite: 'George Fox',
        },
        {
          quote: LOREM,
          cite: 'Rebecca Jones',
        },
      ]}
    />
  ))
  .add('three', () => (
    <TestimonialsBlock
      testimonials={[
        {
          quote: LOREM,
          cite: 'George Fox',
        },
        {
          quote: LOREM + " Let's make it a little longer.",
          cite: 'Rebecca Jones',
        },
        {
          quote: LOREM,
          cite: 'Robert Barclay',
        },
      ]}
    />
  ))
  .add('four', () => (
    <TestimonialsBlock
      testimonials={[
        {
          quote: LOREM,
          cite: 'George Fox',
        },
        {
          quote: LOREM + "Let's make it a little longer.",
          cite: 'Rebecca Jones',
        },
        {
          quote: LOREM,
          cite: 'Robert Barclay',
        },
        {
          quote: LOREM,
          cite: 'Catherine Payton',
        },
      ]}
    />
  ));

storiesOf('Friend page/MapBlock', module).add('basic', () => (
  <MapBlock
    friendName="Ann Branson"
    residences={[
      'London England (1808 -1825)',
      'Scotland (1825 - 1829)',
      'Ireland (1829 - 1891)',
    ]}
    map="UK"
    markers={[
      {
        label: 'London, England',
        top: 69,
        left: 66,
      },
    ]}
  />
));

const quote = `
Humbling herself before God and men, she was exalted by the Lord as a powerful and
prophetic minister, one of the few in her day who stood in the purity and power of the
original Quakers, even while all around her the 200 year old lampstand of the Society
of Friends slowly and tragically burned out.
`;

const blurb = `
Ann Branson (1808-1891) was one of the very last, true ministers (having been prepared,
called, and used of the Lord) in a greatly reduced and sadly degenerate Society. Her
deepest cry to the Lord, from the days of her childhood, was that “His eye would not
pity, nor His hand spare” till He had thoroughly cleansed her heart, and made her a
useful vessel in His house. Humbling herself before God and men, she was exalted by the
Lord as a powerful and prophetic minister, one of the few in her day who stood in the
purity and power of the original Quakers, even while all around her the 200 year old
lampstand of the Society of Friends slowly and tragically burned out.
`;

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
