import React from 'react';
import Link from 'gatsby-link';
import Image from 'gatsby-image';
import { FluidImageObject } from '@friends-library/types';
import { t, Dual } from '../../translation';
import { LANG } from '../../env';
import Heading from '../../Heading';
import './FormatsBlock.css';

interface Props {
  img: FluidImageObject;
  imgMobile: FluidImageObject;
}

const FormatsBlock: React.FC<Props> = ({ img, imgMobile }) => (
  <section className="FormatsBlock py-16 px-12 sm:px-16 relative xl:pl-24 xl:py-24">
    <Heading left={['md']} className="text-gray-900 md:text-left">
      <Dual.frag>
        <>Formats &amp; Editions</>
        <>Formatos</>
      </Dual.frag>
    </Heading>
    <div className="hidden md:block BookMask--lg"></div>
    <div className="md:hidden BookMask--sm"></div>
    <Dual.p className="font-serif antialiased text-lg sm:text-xl text-gray-700 leading-relaxed max-w-screen-lg">
      <>
        On this site you will find many books available in multiple formats. Our desire is
        to make these precious writings as accessible as possible to today&rsquo;s seeker
        of truth&mdash;therefore, each book has been converted to 3 digital formats: pdf,
        mobi (for Kindle), and epub (all other e-readers including Apple Books). A growing
        number of our books are also available{' '}
        <Link to={t`/audiobooks`} className="subtle-link">
          as audiobooks
        </Link>
        . And in addition to these formats (which are 100% free to download), paperback
        books are available <em>at cost</em> for every title offered on our site.
      </>
      <>
        En este sitio encontrarás muchos libros disponibles en múltiples formatos. Nuestro
        deseo es hacer que estos preciosos escritos sean lo más accesibles posible para el
        buscador de la verdad de nuestro día—por lo tanto, cada libro ha sido convertido
        en tres formatos digitales: PDF, MOBI (para Kindle), y EPUB (para todo el resto de
        lectores electrónicos incluyendo “Libros” de Apple). Un número creciente de
        nuestros libros también están disponibles{' '}
        <Link to={t`/audiobooks`} className="subtle-link">
          en audiolibros
        </Link>
        . Y además de estos formatos (que puedes descargar completamente gratis), tenemos
        disponibles libros impresos para cada título, los cuales ofrecemos en nuestro
        sitio{' '}
        <em>sólo cobrando lo que calculamos que nos costará imprimirlo y enviártelo.</em>
      </>
    </Dual.p>
    {LANG === 'en' && (
      <p className="mt-8 font-serif antialiased text-lg sm:text-xl text-gray-700 leading-relaxed max-w-screen-lg">
        Besides offering these books in digital, audio, and printed <em>formats,</em> most
        of these publications are available in different <em>editions</em> as well. We
        offer an original, unedited edition for those who enjoy the archaic language and
        style. But because most readers find the older English somewhat challenging, we
        offer minimally and carefully modernized editions as well. For more information{' '}
        <Link to="/modernization" className="subtle-link">
          click here
        </Link>
        .
      </p>
    )}
    <Image className="Books--lg z-10 hidden md:block" fluid={img} alt="" />
    <Image className="Books--sm z-10 md:hidden" fluid={imgMobile} alt="" />
  </section>
);

export default FormatsBlock;
