import React from 'react';
import centered from '@storybook/addon-centered/react';
import { storiesOf } from '@storybook/react';
import {
  Front,
  webCss,
  staticCss,
  scalingCss,
  docCss,
} from '@friends-library/cover-component';

storiesOf('Cover', module)
  .addDecorator(centered)
  .add('front', () => (
    <div>
      <Front
        lang="en"
        size="m"
        pages={222}
        blurb="some blurb"
        showGuides={false}
        edition="updated"
        title="The Work of Vital Religion in the Soul"
        author="Samuel Rundell"
        customCss=""
        customHtml=""
      />
      <style>
        {staticCss()}
        {webCss()}
        {scalingCss()}
        {docCss()}
      </style>
    </div>
  ));

/* 
<Front />
<Spine />
<Back />
<PrintPdf />
<ThreeD />
*/
