import React from 'react';
import Image from 'gatsby-image';
import { FluidImageObject } from '@friends-library/types';
import { t } from '@friends-library/locale';
import Dual from '../../Dual';
import Heading from '../../Heading';
import './SubHeroBlock.css';

interface Props {
  numTotalBooks: number;
  imgDeviceArray: FluidImageObject;
  imgCover: FluidImageObject;
  imgIPhone: FluidImageObject;
  imgIPad: FluidImageObject;
}

const SubHeroBlock: React.FC<Props> = ({
  numTotalBooks,
  imgDeviceArray,
  imgCover,
  imgIPad,
  imgIPhone,
}) => (
  <section className="SubHeroBlock bg-flprimary p-10 pb-48 relative overflow-hidden md:px-20 lg:px-24 md:pt-20 md:pb-2 md:overflow-visible xl:py-20">
    <Image
      fadeIn={false}
      durationFadeIn={0}
      className="Devices absolute right-0 top-0 hidden md:block"
      fluid={imgDeviceArray}
      alt="Friends Library books on various devices"
    />
    <Heading darkBg className="text-white md:hidden">
      {t`Our Books`}
    </Heading>
    <Dual.p className="font-serif text-white antialiased text-lg sm:text-xl leading-relaxed md:w-2/3 lg:w-4/5 lg:pr-24 md:pr-8 xl:text-2xl xl:max-w-6xl xl:mb-16">
      <>
        Our {numTotalBooks} books are available for free download in multiple editions and
        digital formats, and a growing number of them are also recorded as audiobooks. Or,
        if you prefer, order a paperback — you pay only and exactly what it costs us to
        have them printed and shipped to you.
      </>
      <>
        Nuestros {numTotalBooks} libros están disponibles para descargarse gratuitamente
        en múltiples ediciones y formatos digitales, y un número creciente de estos libros
        están siendo grabados como audiolibros. O si lo prefieres, puedes pedir un libro
        impreso; vas a pagar única y exactamente el costo de impresión y envío.
      </>
    </Dual.p>
    <ul className="flex flex-wrap font-sans text-white uppercase tracking-wider mt-8 mb-12 justify-center antialiased md:justify-start md:max-w-xl lg:max-w-none">
      <li className="Format Format--audio">{t`Audiobooks`}</li>
      <li className="Format Format--paperback">{t`Paperbacks`}</li>
      <li className="Format Format--ebook">{t`E-Books`}</li>
    </ul>
    <Image
      fadeIn={false}
      className="Paperback absolute md:hidden"
      fluid={imgCover}
      alt=""
    />
    <Image
      fadeIn={false}
      className="iPhone absolute shadow-xl md:hidden"
      fluid={imgIPhone}
      alt=""
    />
    <Image
      fadeIn={false}
      className="iPad absolute shadow-xl md:hidden"
      fluid={imgIPad}
      alt=""
    />
  </section>
);

export default SubHeroBlock;
