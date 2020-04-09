import React from 'react';
import Link from 'gatsby-link';
import BackgroundImage from 'gatsby-background-image';
import { FluidBgImageObject } from '@friends-library/types';
import Button from '../../Button';
import { bgLayer } from '../../lib/color';
import { t, Dual } from '../../translation';
import './CompilationsBlock.css';

interface Props {
  bgImg: FluidBgImageObject;
}

const CompilationsBlock: React.FC<Props> = ({ bgImg }) => (
  <BackgroundImage
    fluid={[bgLayer([0, 0, 0], 0.38), bgImg, bgLayer('#333')]}
    rootMargin="300px"
    fadeIn={false}
    id="CompilationsBlock"
    className="text-center text-white px-16 py-24 md:py-24 xl:py-32"
  >
    <h1 className="sans-wider text-4xl font-bold">{t`Compilations`}</h1>
    <Dual.p className="body-text text-white py-8 text-lg leading-loose max-w-screen-sm mx-auto">
      <>
        We also have books that contain a collection of writings from several different
        authors. Some of these books were compiled and published by early Friends, and
        some were compiled more recently by the editors of this website. Among the latter
        group is the book{' '}
        <Link
          to="/compilations/truth-in-the-inward-parts"
          className="subtle-link text-white"
        >
          Truth in the Inward Parts
        </Link>
        , a work containing extracts from the journals and letters of 10 early friends
        describing their discovery of truth and spiritual growth.
      </>
      <>
        También tenemos libros que son una compilación de escritos de varios autores
        diferentes. Algunos de estos libros fueron compilados y publicados por los
        primeros Amigos, y otros fueron compilados más recientemente por los editores de
        este sitio web. En este último grupo está incluido el libro{' '}
        <Link to="/compilaciones/verdad-en-lo-intimo" className="subtle-link text-white">
          La Verdad en lo Íntimo
        </Link>
        , el cual contiene extractos de los diarios y cartas de 10 antiguos Amigos que
        describen su descubrimiento de la verdad y su crecimiento espiritual.
      </>
    </Dual.p>
    <Button to={t`/compilations`} className="mt-4 mx-auto">
      {t`View Compilations`} &rarr;
    </Button>
  </BackgroundImage>
);

export default CompilationsBlock;
