import React from 'react';
import centered from '@storybook/addon-centered/react';
import { storiesOf } from '@storybook/react';
import {
  Spine,
  Back,
  ThreeD,
  PrintPdf,
  Front,
  css as coverCss,
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
        {coverCss.common(props).join('\n')}
        {coverCss.front(props).join('\n')}
        {coverCss.back(props).join('\n')}
        {coverCss.spine(props).join('\n')}
        {coverCss.threeD(props).join('\n')}
      </style>
    </div>
  ))
  .add('pdf', () => (
    <div>
      <div className={wrapClasses(props)}>
        <PrintPdf {...props} />
      </div>
      <style>
        {coverCss.common(props).join('\n')}
        {coverCss.front(props).join('\n')}
        {coverCss.back(props).join('\n')}
        {coverCss.spine(props).join('\n')}
        {coverCss.pdf(props).join('\n')}
      </style>
    </div>
  ))
  .add('spine', () => (
    <div>
      <div className={wrapClasses(props)}>
        <Spine {...props} />
      </div>
      <style>
        {coverCss.common(props).join('\n')}
        {coverCss.spine(props).join('\n')}
      </style>
    </div>
  ))
  .add('back', () => (
    <div>
      <div className={wrapClasses(props)}>
        <Back {...props} />
      </div>
      <style>
        {coverCss.common(props).join('\n')}
        {coverCss.back(props).join('\n')}
      </style>
    </div>
  ))
  .add('front', () => (
    <div>
      <Front {...props} />
      <style>
        {coverCss.common(props).join('\n')}
        {coverCss.front(props).join('\n')}
      </style>
    </div>
  ));
