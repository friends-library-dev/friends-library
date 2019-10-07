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
  size: 's',
  pages: 323,
  //'TODO',
  blurb:
    'Samuel Rundell (1762 - 1848) was a wool-dealer who lived in Liskeard, a small town in southwest England. When young he befriended that worthy elder and "mother in Israel" Catherine Payton (Phillips), whose wisdom and piety no doubt made lasting impressions upon him. As a minister and author, Rundell was particularly concerned to press the necessity of a real and living experience of inward purification by an unreserved obedience to the light or Spirit of Christ working in the heart. Having witnessed in his own soul, he to.',
  showGuides: false,
  edition: 'updated',
  title: 'The Work of Vital Religion in the Soul',
  // title: 'The Life and Letters of Sarah Grubb',
  // title: 'The Life and Letters of Catherine Payton',
  author: 'Samuel Rundell',
  customCss: '',
  customHtml: '',
};

addStaticCss();
let tester = 1;
storiesOf('Cover', module)
  .addDecorator(centered)
  .add('multi-back', () => {
    const sizes: [string, number][] = [
      ['back-full', 1],
      ['back-half', 0.5],
      ['back-third', 0.333333],
      ['back-quarter', 0.225],
      ['back-fifth', 0.14],
      ['back-sixth', 0.1],
    ];
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {sizes.map(([scope, scaler]) => (
          <div className={wrapClasses({ ...props, scope, scaler })}>
            <Back {...props} />
          </div>
        ))}
        {sizes.map(([scope, scaler]) => (
          <Style type="back" scope={scope} scaler={scaler} />
        ))}
      </div>
    );
  })
  .add('multi-front', () => {
    const sizes: [string, number][] = [
      ['full', 1],
      ['half', 0.5],
      ['third', 0.333333],
      ['quarter', 0.225],
      ['fifth', 0.14],
      ['sixth', 0.1],
    ];
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {sizes.map(([scope, scaler]) => (
          <Front {...{ ...props, scope, scaler }} />
        ))}
        {sizes.map(([scope, scaler]) => (
          <Style type="front" scope={scope} scaler={scaler} />
        ))}
      </div>
    );
  })
  .add('three-d (angle-back)', () => (
    <div>
      <ThreeD {...props} perspective="angle-back" />
      <Style type="3d" />
    </div>
  ))
  .add('three-d (angle-front)', () => (
    <div>
      <ThreeD {...props} perspective="angle-front" scope="TEMP" />
      <Style type="3d" scope="TEMP" scaler={1} />
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
      <PrintPdf {...props} />
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
  const prev = document.getElementById('cover-static-css');
  prev && prev.remove();
  const style = document.createElement('style');
  style.id = 'cover-static-css';
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
