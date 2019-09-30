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
  pdfCss,
  threeDCss,
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
  .add('three-d', () => (
    <div>
      <ThreeD {...props} />
      <style>
        {staticCss()}
        {threeDCss(props.size, props.pages)}
        {scalingCss()}
        {docCss(props.size, props.pages)}
      </style>
    </div>
  ))
  .add('pdf', () => (
    <div>
      <div className={wrapClasses(props)}>
        <PrintPdf {...props} />
      </div>
      <style>
        {staticCss()}
        {pdfCss()}
        {scalingCss()}
        {docCss(props.size, props.pages)}
      </style>
    </div>
  ))
  .add('spine', () => (
    <div>
      <div className={wrapClasses(props)}>
        <Spine {...props} />
      </div>
      <style>
        {staticCss()}
        {webCss()}
        {scalingCss()}
        {docCss(props.size, props.pages)}
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
        {docCss(props.size, props.pages)}
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
        {docCss(props.size, props.pages)}
      </style>
    </div>
  ));
