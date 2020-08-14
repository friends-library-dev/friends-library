import React from 'react';
import Link from 'gatsby-link';
import BackgroundImage from 'gatsby-background-image';
import { FluidBgImageObject } from '@friends-library/types';
import { t } from '@friends-library/locale';
import Dual from '../../Dual';
import { bgLayer } from '../../lib/color';

interface Props {
  bgImg: FluidBgImageObject;
}

const GettingStartedLinkBlock: React.FC<Props> = ({ bgImg }) => {
  return (
    <BackgroundImage
      fluid={[bgLayer(`flblue`, 0.8), bgImg]}
      fadeIn={false}
      id="GettingStartedLinkBlock"
      className="p-16 bg-cover sm:p-20 md:p-24"
    >
      <Dual.H3 className="text-white text-center font-sans leading-loose tracking-wider text-lg antialiased">
        <>
          Looking for just a few hand-picked recommendations? Head on over to our{` `}
          <Link className="fl-underline" to={t`/getting-started`}>
            getting started
          </Link>
          {` `}
          page!
        </>
        <>
          ¿Estás buscando solo algunas recomendaciones escogidas? Haz clic aquí para ver
          {` `}
          <Link className="fl-underline" to={t`/getting-started`}>
            cómo comenzar
          </Link>
          .
        </>
      </Dual.H3>
    </BackgroundImage>
  );
};

export default GettingStartedLinkBlock;
