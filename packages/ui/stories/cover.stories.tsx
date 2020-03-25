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
import { CoverProps, PrintSize } from '@friends-library/types';
import { addStaticCoverCss } from './helpers';

export const props: CoverProps & { htmlShortTitle: string } = {
  lang: 'en',
  size: 's',
  pages: 222,
  isCompilation: false,
  blurb:
    'Samuel Rundell (1762 - 1848) was a wool-dealer who lived in Liskeard, a small town in southwest England. When young he befriended that worthy elder and "mother in Israel" Catherine Payton (Phillips), whose wisdom and piety no doubt made lasting impressions upon him. As a minister and author, Rundell was particularly concerned to press the necessity of a real and living experience of inward purification by an unreserved obedience to the light or Spirit of Christ working in the heart. Having witnessed in his own soul, he to.',
  showGuides: false,
  edition: 'updated',
  title: 'The Work of Vital Religion in the Soul',
  htmlShortTitle: 'The Work of Vital Religion in the Soul',
  isbn: '978-1-64476-000-0',
  author: 'Samuel Rundell',
  customCss: '',
  customHtml: '',
};

addStaticCoverCss(
  css`
    .all-sizes {
      width: 17in;
    }
    .all-sizes .Cover {
      vertical-align: top;
    }
    .Cover + .Cover,
    style + .Cover {
      margin-left: 20px;
    }
    .Cover-storybook-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #eaeaea;
    }
  `,
);

storiesOf('Cover', module)
  .addDecorator(centered)
  .addDecorator(storyFn => <div className="Cover-storybook-bg">{storyFn()}</div>)
  .add('back (s, m, xl)', () => (
    <div className="all-sizes">
      <Wrapped type="back" {...{ scope: 's', size: 's' }} />
      <Wrapped type="back" {...{ scope: 'm', size: 'm' }} />
      <Wrapped type="back" {...{ scope: 'xl', size: 'xl' }} />
      <Style type="back" size="s" scope="s" />
      <Style type="back" size="m" scope="m" />
      <Style type="back" size="xl" scope="xl" />
    </div>
  ))
  .add('front (s, m, xl)', () => (
    <div className="all-sizes">
      <Front {...p({ scope: 's', size: 's' })} />
      <Front {...p({ scope: 'm', size: 'm' })} />
      <Front {...p({ scope: 'xl', size: 'xl' })} />
      <Style type="front" size="s" scope="s" />
      <Style type="front" size="m" scope="m" />
      <Style type="front" size="xl" scope="xl" />
    </div>
  ))
  .add('front-main (multi)', () => {
    const books: [string, string, string][] = [];
    // @ts-ignore
    (window.FRIENDS as any).forEach(friend => {
      friend.documents.forEach((doc: any) => {
        books.push([doc.id, doc.title, friend.name]);
      });
    });
    return (
      <div className="grid">
        <style>{css`
          .grid {
            display: flex;
            flex-wrap: wrap;
            margin-right: -1.25em;
          }
          .grid .square {
            height: 4.42in;
            overflow: hidden;
            border: 1.25em solid transparent;
            border-left-width: 0;
            border-top-width: 0;
          }
          .grid .square .Cover {
            top: -1.5in;
          }
          .grid .square .author {
            opacity: 0;
          }
        `}</style>
        {books.map(([scope, title, author]) => (
          <div className="square">
            <Front {...p({ scope, author, title, size: 's' })} />
            <Style type="front" scope={scope} author={author} size="s" />
          </div>
        ))}
      </div>
    );
  })
  .add('back (scaled)', () => {
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
          <>
            <Wrapped type="back" {...{ scope, scaler }} />
            <Style type="back" scope={scope} scaler={scaler} />
          </>
        ))}
      </div>
    );
  })
  .add('front (scaled)', () => {
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
          <>
            <Front {...p({ scope, scaler })} />
            <Style type="front" scope={scope} scaler={scaler} />
          </>
        ))}
      </div>
    );
  })
  .add('3d (angle-back)', () => (
    <div>
      <ThreeD {...props} perspective="angle-back" />
      <Style type="3d" />
    </div>
  ))
  .add('3d (angle-front)', () => (
    <div>
      <ThreeD {...props} perspective="angle-front" />
      <Style type="3d" />
    </div>
  ))
  .add('pdf', () => (
    <div>
      <PrintPdf {...props} />
      <Style type="pdf" />
    </div>
  ))
  .add('pdf (no-bleed)', () => (
    <div>
      <PrintPdf {...props} bleed={false} />
      <Style type="pdf" />
    </div>
  ))
  .add('pdf (guides)', () => (
    <div>
      <PrintPdf {...p({ showGuides: true })} />
      <Style type="pdf" showGuides={true} />
    </div>
  ))
  .add('spine', () => (
    <div>
      <Wrapped type="spine" />
      <Style type="spine" />
    </div>
  ))
  .add('spine (s, m, xl)', () => {
    const sizes: PrintSize[] = ['s', 'm', 'xl'];
    return (
      <div>
        {sizes.map(size => {
          return (
            <>
              <Wrapped
                type="spine"
                {...p({ size, scope: size })}
                style={{ marginRight: 75 }}
              />
              <Style type="spine" scope={size} size={size} />
            </>
          );
        })}
      </div>
    );
  })
  .add('back', () => (
    <div>
      <Wrapped type="back" />
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
  showGuides?: boolean;
  size?: PrintSize;
  type: '3d' | 'front' | 'back' | 'spine' | 'pdf';
}> = ({ type, scaler, scope, author, showGuides, size }) => {
  const useProps = {
    ...props,
    size: size || props.size,
    author: author || props.author,
    showGuides: showGuides || props.showGuides,
  };
  const args: [number?, string?] = [scaler, scope];
  return (
    <style>
      {coverCss.common(...args)[1]}
      {['front', '3d', 'pdf'].includes(type) ? coverCss.front(...args)[1] : ''}
      {['back', '3d', 'pdf'].includes(type) ? coverCss.back(...args)[1] : ''}
      {['spine', '3d', 'pdf'].includes(type) ? coverCss.spine(...args)[1] : ''}
      {useProps.showGuides ? coverCss.guides(...args)[1] : ''}
      {type === '3d' ? coverCss.threeD(...args)[1] : ''}
      {type === 'pdf' ? coverCss.pdf(useProps, ...args)[1] : ''}
    </style>
  );
};

const Wrapped: React.FC<Partial<CoverProps> & {
  type: 'back' | 'spine';
  style?: Record<string, string | number>;
}> = wProps => {
  const useProps = p(wProps);
  return (
    <div
      className={wrapClasses(useProps, `type--${wProps.type}`)}
      style={wProps.style ? wProps.style : {}}
    >
      {wProps.type === 'back' && <Back {...useProps} />}
      {wProps.type === 'spine' && <Spine {...useProps} />}
    </div>
  );
};

function p(overrides: Partial<CoverProps>): CoverProps {
  return { ...props, ...overrides };
}

function css(strings: any, ...values: any[]): string {
  let str = '';
  strings.forEach((string: string, i: number) => {
    str += string + (values[i] || '');
  });
  return str;
}
