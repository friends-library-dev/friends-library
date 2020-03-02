import React from 'react';
import { storiesOf } from '@storybook/react';
import { coverSizes } from './decorators';
import { props as coverProps } from './cover.stories';
import Audiobook from '../src/pages/audiobooks/Audiobook';

storiesOf('Audiobooks Page', module)
  .addDecorator(coverSizes)
  .add('Audiobook', () => (
    <Audiobook
      {...coverProps}
      bgColor="blue"
      duration="45:00"
      documentUrl="/"
      authorUrl="/"
      description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo."
    />
  ));
