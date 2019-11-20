import React from 'react';
import { storiesOf } from '@storybook/react';
import DocBlock from '../src/blocks/DocBlock';
import { coverSizes } from './decorators';

storiesOf('Doc Page', module)
  .addDecorator(coverSizes)
  .add('DocBlock', () => (
    <DocBlock
      lang="en"
      title="The Journal and Writings of Ambrose Rigge"
      author="Ambrose Rigge"
      size="m"
      pages={222}
      edition="modernized"
      blurb="some blurb"
      showGuides={false}
      customCss=""
      customHtml=""
      authorSlug="ambrose-rigge"
      price={499}
      hasAudio={true}
      numChapters={15}
      hasAltLanguageVersion={true}
    />
  ));
