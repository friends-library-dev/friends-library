import React from 'react';
import Link from 'gatsby-link';
import { t, Dual } from '../../translation';
import './GettingStartedLinkBlock.css';

const GettingStartedLinkBlock: React.FC = () => {
  return (
    <div className="GettingStartedLinkBlock p-16 bg-cover sm:p-20 md:p-24">
      <Dual.h3 className="text-white text-center font-sans leading-loose tracking-wider text-lg antialiased">
        <>
          Looking for just a few hand-picked recommendations? Head on over to our{' '}
          <Link className="fl-underline" to={t`/getting-started`}>
            getting started
          </Link>{' '}
          page!
        </>
        <>
          ¿Estás buscando solo algunas recomendaciones escogidas? Haz clic aquí para ver{' '}
          <Link className="fl-underline" to={t`/getting-started`}>
            cómo comenzar
          </Link>
          .
        </>
      </Dual.h3>
    </div>
  );
};

export default GettingStartedLinkBlock;
