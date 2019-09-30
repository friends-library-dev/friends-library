import React from 'react';
import centered from '@storybook/addon-centered/react';
import { storiesOf } from '@storybook/react';
import {
  Spine,
  Back,
  ThreeD,
  PrintPdf,
  Front,
  webCss,
  staticCss,
  scalingCss,
  docCss,
  wrapClasses,
} from '@friends-library/cover-component';
import { CoverProps } from '@friends-library/types';

const props: CoverProps = {
  lang: 'en',
  size: 'm',
  pages: 222,
  blurb: 'some blurb',
  showGuides: false,
  edition: 'updated',
  title: 'The Work of Vital Religion in the Soul',
  author: 'Samuel Rundell',
  customCss: '',
  customHtml: '',
};

storiesOf('Cover', module)
  .addDecorator(centered)
  .add('spine', () => (
    <div>
      <div className={wrapClasses(props)}>
        <Spine {...props} />
      </div>
      <style>
        {staticCss()}
        {webCss()}
        {scalingCss()}
        {docCss()}
      </style>
    </div>
  ))
  .add('back', () => (
    <div>
      <div className={wrapClasses(props)}>
        <Back {...props} />
      </div>
      <style>
        {staticCss()}
        {webCss()}
        {scalingCss()}
        {docCss()}
      </style>
    </div>
  ))
  .add('front', () => (
    <div>
      <Front {...props} />
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
