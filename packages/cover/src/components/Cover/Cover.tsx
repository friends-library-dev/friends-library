import React from 'react';
import { CoverProps, Html } from '@friends-library/types';
import { isBrowser } from 'browser-or-node';
import classNames from 'classnames';
import LogoIcon from './LogoIcon';
import Logo from './Logo';
import LogoSpanish from './LogoSpanish';
import Diamonds from './Diamonds';
import Brackets from './Brackets';
import EditableBlurb from './EditableBlurb';

const publicUrl = process.env.PUBLIC_URL || '';

interface Props extends CoverProps {
  updateBlurb: (blurb: string) => void;
  allowEditingBlurb: boolean;
}

const Cover: React.FC<Props> = props => {
  const {
    title,
    author,
    isbn,
    edition,
    blurb,
    showGuides,
    pages,
    updateBlurb,
    customHtml,
    allowEditingBlurb,
  } = props;
  const [firstInitial, lastInitial] = initials(author);
  const Diamond = Diamonds[edition];
  const fragments = getHtmlFragments(customHtml);
  const lang = edition === 'spanish' ? 'es' : 'en';
  return (
    <div className={`cover${showGuides ? ' cover--show-guides' : ''}`}>
      {isBrowser && <div className="cover-mask" />}
      <div className="bg-block" />
      <div className={`back ${blurbClasses(blurb)}`}>
        <div className="back__safe">
          <Diamond />
          {overridable(
            'blurb',
            fragments,
            allowEditingBlurb ? (
              <EditableBlurb blurb={blurb} update={updateBlurb} />
            ) : (
              <div className="blurb">{blurb}</div>
            ),
          )}
          <Brackets />
          {isbn && (
            <img className="isbn" src={`${publicUrl}/images/isbn/${isbn}.png`} alt="" />
          )}
          <div className="about-flp">
            <p className="purpose">
              {lang === 'es' ? (
                <>
                  <b>La Biblioteca de los Amigos</b> existe para compartir de forma
                  gratuita los escritos de los primeros miembros de la Sociedad Religiosa
                  de Amigos (Cuáqueros), creyendo que ninguna otra colección de escritos
                  cristianos demuestra de manera más clara o convincente el poder
                  transformador del evangelio de Jesucristo.
                </>
              ) : (
                <>
                  <b>Friends Library Publishing</b> exists to freely share the writings of
                  early members of the Religious Society of Friends (Quakers), believing
                  that no other collection of Christian writings more accurately
                  communicates or powerfully illustrates the soul-transforming power of
                  the gospel of Jesus Christ.
                </>
              )}
            </p>
            <p className="website">
              {lang === 'es' ? (
                <>
                  Descarga este y otros libros gratis en{' '}
                  <b>www.labibliotecadelosamigos.com</b>.
                </>
              ) : (
                <>
                  Download this and other books for free at <b>www.friendslibrary.com</b>.
                </>
              )}
            </p>
          </div>
          {lang === 'es' ? <LogoSpanish /> : <Logo />}
        </div>
      </div>
      <div className={spineClasses(pages)}>
        <LogoIcon />
        <Diamond />
        {overridable(
          'spine__title',
          fragments,
          <div className="spine__title" dangerouslySetInnerHTML={{ __html: title }} />,
        )}
        {overridable(
          'spine__author',
          fragments,
          <div className="spine__author">{author.split(' ').pop()}</div>,
        )}
        <div className="guide guide--spine guide--vertical guide--spine-center" />
      </div>
      <div className="front">
        <div className="front__safe">
          <span className="flp">
            {lang === 'es' ? 'Biblioteca de los Amigos' : 'Friends Library Publishing'}
          </span>
          <LogoIcon />
          <div
            className={classNames(
              'front__main',
              `front__main--first-initial--${firstInitial}`,
              `front__main--initials--${firstInitial}${lastInitial}`,
            )}
          >
            <div className="guide guide--letter-spacing" />
            <div className="guide guide--vertical guide--front-vertical-center" />
            <div className="initials">
              <div className="initials__top">
                <span
                  className={classNames(
                    'initial',
                    'initial--first',
                    `initial--X${lastInitial}`,
                    `initial--${firstInitial}`,
                    `initials--${firstInitial}${lastInitial}`,
                  )}
                >
                  {firstInitial}
                </span>
              </div>
              <div className="initials__bottom">
                <span
                  className={classNames(
                    'initial',
                    'initial--last',
                    `initial--${firstInitial}X`,
                    `initial--${lastInitial}`,
                    `initials--${firstInitial}${lastInitial}`,
                  )}
                >
                  {lastInitial}
                </span>
              </div>
            </div>
            {overridable(
              'title-wrap',
              fragments,
              <div className="title-wrap">
                <h1 className="title" dangerouslySetInnerHTML={{ __html: title }} />
              </div>,
            )}
          </div>
          {overridable(
            'author',
            fragments,
            <div className="author">
              <div className="author__line" />
              <h2 className="author__name">{author}</h2>
            </div>,
          )}
        </div>
      </div>
      {isBrowser && (
        <>
          <div className="top" />
          <div className="bottom" />
          <div className="right" />
        </>
      )}
      <div className="guide guide--box guide--trim-bleed" />
      <div className="guide guide--spine guide--vertical guide--spine-left" />
      <div className="guide guide--spine guide--vertical guide--spine-right" />
    </div>
  );
};

Cover.defaultProps = {
  updateBlurb: () => {},
  allowEditingBlurb: false,
};

export default Cover;

function initials(author: string): [string, string] {
  const [first, ...rest] = author.split(' ');
  return [first[0].toUpperCase(), rest[rest.length - 1][0].toUpperCase()];
}

function spineClasses(pages: number): string {
  const classes = ['spine'];
  const rounded = Math.floor(pages / 10) * 10;
  for (let i = 130; i <= 220; i += 10) {
    rounded < i && classes.push(`spine--pgs-lt-${i}`);
    rounded <= i && classes.push(`spine--pgs-lte-${i}`);
    rounded > i && classes.push(`spine--pgs-gt-${i}`);
    rounded >= i && classes.push(`spine--pgs-gte-${i}`);
  }
  return classes.join(' ');
}

function blurbClasses(blurb: string): string {
  const classes: string[] = [];
  for (let i = 150; i <= 1000; i += 25) {
    classes.push(`blurb--${blurb.length < i ? 'lt' : 'gte'}-${i}`);
  }
  return classes.join(' ');
}

function getHtmlFragments(html: Html): Record<string, Html> {
  const fragments: Record<string, Html> = {};
  const regex = /(?:^|\n)<(div|p|h\d).+?\n<\/\1>/gs;
  let match;
  while ((match = regex.exec(html))) {
    const lines = match[0]
      .trim()
      .split('\n')
      .map(s => s.trim());
    lines.pop();
    const classMatch = (lines.shift() || '').match(/class="([^ "]+)/);
    if (!classMatch) {
      throw new Error(`Bad custom HTML -- frag wrapping elements must have class`);
    }
    fragments[classMatch[1]] = lines.join('');
  }
  return fragments;
}

function overridable(
  key: string,
  fragments: Record<string, Html>,
  fallback: JSX.Element,
): JSX.Element {
  if (fragments[key] !== undefined) {
    return React.createElement(key === 'blurb' ? 'div' : fallback.type, {
      className: key,
      dangerouslySetInnerHTML: { __html: fragments[key] },
    });
  }
  return fallback;
}
