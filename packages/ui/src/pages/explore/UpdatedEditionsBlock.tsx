import React from 'react';
import Link from 'gatsby-link';
import { LANG } from '../../env';
import { Dual, t } from '../../translation';
import { Book } from './types';
import BgWordBlock from './BgWordBlock';
import BookSlider from './BookSlider';
import './UpdatedEditionsBlock.css';

interface Props {
  books: Book[];
}

const UpdatedEditionsBlock: React.FC<Props> = ({ books }) => (
  <BgWordBlock
    id="UpdatedEditionsBlock"
    className="UpdatedEditionsBlock p-10 flex flex-col items-center md:py-16"
    word={LANG === 'en' ? 'Updated' : 'Libros'}
    title={LANG === 'en' ? 'Updated Editions' : 'Libros'}
  >
    <Dual.p className="body-text pb-12 max-w-screen-md leading-loose">
      <>
        We currently have <b>{books.length}</b> books available in an{' '}
        <em>updated edition</em>, with more being added regularly. Our updated editions
        are our top recommendation for most visitors to this site. For more information
        about our editions,{' '}
        <Link to="/editions" className="subtle-link">
          see here
        </Link>
        .
      </>
      <>
        Más abajo puedes desplazarte por todos los libros que están actualmente
        disponibles en español. Si no estás seguro por dónde empezar, hemos preparado
        algunas recomendaciones para ti en nuestra página{' '}
        <Link to={t`/getting-started`} className="subtle-link">
          Comenzar
        </Link>
        .
      </>
    </Dual.p>
    <BookSlider books={books} />
  </BgWordBlock>
);

export default UpdatedEditionsBlock;
