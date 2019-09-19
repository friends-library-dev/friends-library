import React from 'react';
import { storiesOf } from '@storybook/react';
import { CoverFront, webCss, staticCss, scalingCss, docCss } from '../src/cover';

storiesOf('Cover', module).add('front', () => (
  <div className="web">
    <CoverFront
      lang="en"
      firstInitial="S"
      lastInitial="R"
      title="The Work of Vital Religion in the Soul"
      author="Samuel Rundell"
      fragments={{}}
    />
    <style>
      {staticCss()}
      {webCss()}
      {scalingCss()}
      {docCss()}
    </style>
  </div>
));
