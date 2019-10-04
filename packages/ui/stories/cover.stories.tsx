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
  pages: 323,
  blurb: 'some blurb',
  showGuides: false,
  edition: 'modernized',
  // title: 'The Work of Vital Religion in the Soul',
  title: 'The Life and Letters of Sarah Grubb',
  // title: 'The Life and Letters of Catherine Payton',
  author: 'Sarah Grubb',
  customCss: '',
  customHtml: '',
};

addStaticCss();

storiesOf('Cover', module)
  .addDecorator(centered)
  .add('multi-front', () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Front {...props} scope="full" />
      <Front {...props} scope="half" />
      <Front {...props} scope="third" />
      <Front {...props} scope="quarter" />
      <Front {...props} scope="fifth" />
      <Front {...props} scope="sixth" />
      <Style type="front" scope="full" scaler={1.03} />
      <Style type="front" scope="half" scaler={0.5} />
      <Style type="front" scope="third" scaler={0.3333333333} />
      <Style type="front" scope="quarter" scaler={0.225} />
      <Style type="front" scope="fifth" scaler={0.14} />
      <Style type="front" scope="sixth" scaler={0.1} />
    </div>
  ))
  .add('three-d (angle-back)', () => (
    <div>
      <ThreeD {...props} perspective="angle-back" />
      <Style type="3d" />
    </div>
  ))
  .add('three-d (angle-front)', () => (
    <div>
      <ThreeD {...props} perspective="angle-front" scope="TEMP" />
      <Style type="3d" scope="TEMP" scaler={0.4} />
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
      <div className={wrapClasses({ ...props, scope: 'match-old' })}>
        <Spine {...props} />
      </div>
      <Style type="spine" scope="match-old" scaler={0.815} />
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

const Style: React.FC<{
  scaler?: number;
  scope?: string;
  type: '3d' | 'front' | 'back' | 'spine' | 'pdf';
}> = ({ type, scaler, scope }) => {
  const args: [CoverProps, number?, string?] = [props, scaler, scope];
  return (
    <style>
      {coverCss.common(...args)[1]}
      {['front', '3d', 'pdf'].includes(type) ? coverCss.front(...args)[1] : ''}
      {['back', '3d', 'pdf'].includes(type) ? coverCss.back(...args)[1] : ''}
      {['spine', '3d', 'pdf'].includes(type) ? coverCss.spine(...args)[1] : ''}
      {type === '3d' ? coverCss.threeD(...args)[1] : ''}
      {type === 'pdf' ? coverCss.pdf(...args)[1] : ''}
    </style>
  );
};

function addStaticCss() {
  const style = document.createElement('style');
  style.type = 'text/css';
  const css = `
    ${coverCss.common(props)[0]}
    ${coverCss.front(props)[0]}
    ${coverCss.back(props)[0]}
    ${coverCss.spine(props)[0]}
    ${coverCss.threeD(props)[0]}
    ${coverCss.pdf(props)[0]}
    .Cover + .Cover { margin-left: 5px; }
  `;
  style.appendChild(document.createTextNode(css));
  document.getElementsByTagName('head')[0].appendChild(style);
}
