import React from 'react';
import { CoverProps } from '@friends-library/types';
import Diamonds from './Diamonds';
import { overridable, formatBlurb, getHtmlFragments } from './helpers';
import Brackets from './Brackets';
import EditableBlurb from './EditableBlurb';
import LogoSpanish from './LogoSpanish';
import Logo from './Logo';

type Props = Pick<
  CoverProps,
  | 'blurb'
  | 'customHtml'
  | 'isbn'
  | 'lang'
  | 'edition'
  | 'allowEditingBlurb'
  | 'updateBlurb'
> & {
  bgOnly?: boolean;
  style?: { [k in string]: number | string };
};

const Back: React.FC<Props> = ({
  blurb,
  isbn,
  lang,
  edition,
  allowEditingBlurb,
  updateBlurb,
  customHtml,
  bgOnly,
  style,
}) => {
  const Diamond = Diamonds[lang === `es` ? `spanish` : edition];
  const fragments = getHtmlFragments(customHtml);
  return (
    <div className={`back has-bg ${blurbClasses(blurb)}`} style={style || {}}>
      <div className="back__safe">
        {bgOnly !== true && (
          <>
            <Diamond />
            {overridable(
              `blurb`,
              fragments,
              allowEditingBlurb ? (
                <div className="blurb">
                  <Brackets />
                  <EditableBlurb
                    blurb={formatBlurb(blurb)}
                    update={updateBlurb || (() => {})}
                  />
                </div>
              ) : (
                <div className="blurb">
                  <Brackets />
                  {formatBlurb(blurb)}
                </div>
              ),
            )}
            {isbn && (
              <img
                className="isbn"
                src={`https://flp-assets.nyc3.digitaloceanspaces.com/static/isbn/${isbn}.png`}
                alt=""
              />
            )}
            <div className="about-flp">
              <p className="purpose">
                {lang === `es` ? (
                  <>
                    <b>La Biblioteca de los Amigos</b> existe para compartir de forma
                    gratuita los escritos de los primeros miembros de la Sociedad
                    Religiosa de Amigos (Cuáqueros), creyendo que ninguna otra colección
                    de escritos cristianos demuestra de manera más clara o convincente el
                    poder transformador del evangelio de Jesucristo.
                  </>
                ) : (
                  <>
                    <b>Friends Library Publishing</b> exists to freely share the writings
                    of early members of the Religious Society of Friends (Quakers),
                    believing that no other collection of Christian writings more
                    accurately communicates or powerfully illustrates the
                    soul-transforming power of the gospel of Jesus Christ.
                  </>
                )}
              </p>
              <p className="website">
                {lang === `es` ? (
                  <>
                    Descarga este y otros libros gratis en{` `}
                    <b>www.bibliotecadelosamigos.org</b>.
                  </>
                ) : (
                  <>
                    Download this and other books for free at{` `}
                    <b>www.friendslibrary.com</b>.
                  </>
                )}
              </p>
            </div>
            {lang === `es` ? <LogoSpanish /> : <Logo />}
          </>
        )}
      </div>
    </div>
  );
};

export default Back;

function blurbClasses(blurb: string): string {
  const classes: string[] = [];
  for (let i = 150; i <= 1000; i += 25) {
    classes.push(`blurb--${blurb.length < i ? `lt` : `gte`}-${i}`);
  }
  return classes.join(` `);
}
