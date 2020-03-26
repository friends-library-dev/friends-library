import React from 'react';
import { storiesOf } from '@storybook/react';
import { coverSizes } from './decorators';
import PathBlock from '../src/pages/getting-started/PathBlock';
import { props as coverProps } from './cover.stories';

storiesOf('Getting Started Page', module)
  .addDecorator(coverSizes)
  .add('PathBlock', () => (
    <PathBlock title="Devotional" books={[...books]} color="blue" />
  ));

const books = [
  {
    ...coverProps,
    title: 'No Cross, No Crown',
    author: 'William Penn',
    documentUrl: '/no-cross-no-crown',
    authorUrl: '/',
    hasAudio: true,
  },
  {
    ...coverProps,
    title: 'The Journal of Charles Marshall',
    author: 'Charles Marshall',
    documentUrl: '/charles-marshall/journal',
    authorUrl: '/',
    hasAudio: true,
  },
  {
    ...coverProps,
    title: 'Life and Letters of Catherine Payton',
    author: 'Catherine Payton',
    edition: 'modernized' as const,
    documentUrl: '/catherine-payton/life-letters',
    authorUrl: '/',
    hasAudio: false,
  },
  {
    ...coverProps,
    documentUrl: '/',
    authorUrl: '/',
    hasAudio: true,
  },
];
