import React from 'react';
import centered from '@storybook/addon-centered/react';
import { storiesOf, addDecorator } from '@storybook/react';
import {
  Spine,
  Back,
  ThreeD,
  PrintPdf,
  Front,
  css as coverCss,
  wrapClasses,
} from '@friends-library/cover-component';
import { CoverProps, PrintSize } from '@friends-library/types';

const props: CoverProps = {
  lang: 'en',
  size: 'm',
  pages: 283,
  //'TODO',
  blurb:
    'Samuel Rundell (1762 - 1848) was a wool-dealer who lived in Liskeard, a small town in southwest England. When young he befriended that worthy elder and "mother in Israel" Catherine Payton (Phillips), whose wisdom and piety no doubt made lasting impressions upon him. As a minister and author, Rundell was particularly concerned to press the necessity of a real and living experience of inward purification by an unreserved obedience to the light or Spirit of Christ working in the heart. Having witnessed in his own soul, he to.',
  showGuides: true,
  edition: 'updated',
  title: 'The Work of Vital Religion in the Soul',
  // title: 'The Life and Letters of Sarah Grubb',
  // title: 'The Life and Letters of Catherine Payton',
  author: 'Samuel Rundell',
  customCss: '',
  customHtml: '',
};

addStaticCss();

addDecorator(centered);
storiesOf('Cover', module)
  .add('back (s, m, xl)', () => (
    <div className="all-sizes-back">
      <style>{`
        .all-sizes-back .Cover + .Cover {
          margin-left: 20px;
        }
        .all-sizes-back .Cover {
          vertical-align: top;
        }
      `}</style>
      <div className={wrapClasses({ ...{ ...props, scope: 's', size: 's' } })}>
        <Back {...{ ...props, scope: 's', size: 's' }} />
      </div>
      <div className={wrapClasses({ ...{ ...props, scope: 'm', size: 'm' } })}>
        <Back {...{ ...props, scope: 'm', size: 'm' }} />
      </div>
      <div className={wrapClasses({ ...{ ...props, scope: 'xl', size: 'xl' } })}>
        <Back {...{ ...props, scope: 'xl', size: 'xl' }} />
      </div>
      <Style type="back" size="s" scope="s" />
      <Style type="back" size="m" scope="m" />
      <Style type="back" size="xl" scope="xl" />
    </div>
  ))
  .add('front (s, m, xl)', () => (
    <div className="all-sizes-front">
      <style>{`
        .all-sizes-front .Cover + .Cover {
          margin-left: 20px;
        }
        .all-sizes-front .Cover {
          vertical-align: top;
        }
      `}</style>
      <Front {...{ ...props, scope: 's', size: 's' }} />
      <Front {...{ ...props, scope: 'm', size: 'm' }} />
      <Front {...{ ...props, scope: 'xl', size: 'xl' }} />
      <Style type="front" size="s" scope="s" />
      <Style type="front" size="m" scope="m" />
      <Style type="front" size="xl" scope="xl" />
    </div>
  ))
  .add(
    'front-main (multi)',
    () => {
      const books: [string, string, string][] = [];
      // @ts-ignore
      (window.FRIENDS as any).forEach(friend => {
        friend.documents.forEach((doc: any) => {
          books.push([doc.id, doc.title, friend.name]);
        });
      });
      return (
        <div className="grid">
          <style>{`
            .grid { display: flex; flex-wrap: wrap; margin-right: -1.25em; }
            .grid .square { height: 4.42in; overflow: hidden; border: 1.25em solid transparent; border-left-width: 0; border-top-width: 0;}
            .grid .square .Cover { top: -1.5in; }
            .grid .square .author { opacity: 0; }
          `}</style>
          {books.map(([scope, title, author]) => (
            <div className="square">
              <Front {...{ ...props, scope, author, title }} />
              <Style type="front" scope={scope} author={author} />
            </div>
          ))}
        </div>
      );
    },
    { centered: { disable: true } },
  )
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
  author?: string;
  size?: PrintSize;
  type: '3d' | 'front' | 'back' | 'spine' | 'pdf';
}> = ({ type, scaler, scope, author, size }) => {
  const useProps = { ...props, size: size || props.size, author: author || props.author };
  const args: [CoverProps, number?, string?] = [useProps, scaler, scope];
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
