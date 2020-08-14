import React from 'react';
import Link from 'gatsby-link';
import cx from 'classnames';
import { LANG } from '../../env';
import Dual from '../../Dual';
import AmigosLogo from '../../LogoAmigos';
import FriendsLogo from '../../LogoFriends';
import './AltSiteBlock.css';

const AltSiteBlock: React.FC<{ numBooks: number; url: string }> = ({ numBooks, url }) => {
  const Logo = LANG === `en` ? AmigosLogo : FriendsLogo;
  return (
    <div
      className={cx(
        `AltSiteBlock p-16 text-white font-sans text-lg antialiased tracking-wide text-center leading-loose relative overflow-hidden`,
        {
          'bg-flgold': LANG === `en`,
          'bg-flmaroon': LANG === `es`,
        },
      )}
    >
      <Logo
        className="absolute"
        libraryColor="white"
        iconColor="white"
        friendsColor="white"
      />
      <Dual.H3 className="relative z-50">
        <>
          We also have {numBooks} books{` `}
          <Link to="/spanish-translations" className="subtle-link text-white">
            translated
          </Link>
          {` `}
          into Spanish! Switch to our{` `}
          <a className="fl-underline" href={url}>
            Spanish site here.
          </a>
        </>
        <>
          ¡Nosotros también tenemos {numBooks} libros disponibles en inglés! Visita a
          nuestro{` `}
          <a href={url} className="fl-underline">
            sitio en inglés aquí.
          </a>
        </>
      </Dual.H3>
    </div>
  );
};

export default AltSiteBlock;
