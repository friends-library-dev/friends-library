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

const Style: React.FC<{ type: '3d' | 'front' | 'back' | 'spine' | 'pdf' }> = ({
  type,
}) => {
  return (
    <style>
      {coverCss.common(props).join('\n')}
      {['front', '3d', 'pdf'].includes(type) ? coverCss.front(props).join('\n') : ''}
      {['back', '3d', 'pdf'].includes(type) ? coverCss.back(props).join('\n') : ''}
      {['spine', '3d', 'pdf'].includes(type) ? coverCss.spine(props).join('\n') : ''}
      {type === '3d' ? coverCss.threeD(props).join('\n') : ''}
      {type === 'pdf' ? coverCss.pdf(props).join('\n') : ''}
    </style>
  );
};

storiesOf('Cover', module)
  .addDecorator(centered)
  .add('three-d (angle-back)', () => (
    <div>
      <ThreeD {...props} perspective="angle-back" />
      <Style type="3d" />
    </div>
  ))
  .add('three-d (angle-front)', () => (
    <div>
      <ThreeD {...props} perspective="angle-front" />
      <Style type="3d" />
    </div>
  ))
  .add('three-d (front)', () => (
    <div>
      <ThreeD {...props} perspective="front" />
      <Style type="3d" />
    </div>
  ))
  .add('three-d (back)', () => (
    <div>
      <ThreeD {...props} perspective="back" />
      <Style type="3d" />
    </div>
  ))
  .add('three-d (spine)', () => (
    <div>
      <ThreeD {...props} perspective="spine" />
      <Style type="3d" />
    </div>
  ))
  .add('pdf', () => (
    <div>
      <div className={wrapClasses(props)}>
        <PrintPdf {...props} />
      </div>
      <Style type="pdf" />
    </div>
  ))
  .add('spine', () => (
    <div>
      <div className={wrapClasses(props)}>
        <Spine {...props} />
      </div>
      <Style type="spine" />
    </div>
  ))
  .add('back', () => (
    <div>
      <div className={wrapClasses(props)}>
        <Back {...props} />
      </div>
      <Style type="back" />
    </div>
  ))
  .add('front', () => (
    <div>
      <Front {...props} />
      <Style type="front" />
    </div>
  ));
