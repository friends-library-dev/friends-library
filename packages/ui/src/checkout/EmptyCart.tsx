import React from 'react';
import cx from 'classnames';
import Link from 'gatsby-link';
import { t, Dual } from '../translation';
import Header from './Header';
import Button from '../Button';

export interface Props {
  recommendedBooks: {
    Cover: JSX.Element;
    title: string;
    path: string;
  }[];
}

const EmptyCart: React.FC<Props> = ({ recommendedBooks }) => {
  return (
    <div>
      <Header>
        <Dual.frag>
          <>Empty Cart</>
          <>Tu carrito está vacío</>
        </Dual.frag>
      </Header>
      <Dual.p className="body-text text-center">
        <>
          There's nothing in your cart! Below are a few recommendations, or you can check
          out our{' '}
          <Link to={t`/getting-started`} className="subtle-link">
            getting started picks
          </Link>
          , or{' '}
          <Link to={t`/explore`} className="subtle-link">
            explore all the books
          </Link>
          .
        </>
        <>
          ¡No hay nada en tu carrito! Abajo encontrarás algunas recomendaciones, también
          puedes ver nuestra{' '}
          <Link to={t`/getting-started`} className="subtle-link">
            selección de libros para comenzar
          </Link>
          , o{' '}
          <Link to={t`/explore`} className="subtle-link">
            explorar todos nuestros libros
          </Link>
          .
        </>
      </Dual.p>
      <div className="flex flex-col items-center md:flex-row md:justify-center md:items-start mt-8 px-6">
        {recommendedBooks.map(({ Cover, title, path }, idx) => (
          <Link
            to={path}
            key={title}
            className={cx(
              'flex flex-col items-center hover:underline mb-6 md:flex md:w-1/3',
              {
                hidden: idx > 1,
              },
            )}
          >
            {Cover}
            <h3
              className="font-sans text-center mt-4 text-lg text-gray-800 tracking-wide"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </Link>
        ))}
      </div>
      <Button to={t`/explore`} className="mx-auto mt-4" shadow>
        {t`Explore Books`}
      </Button>
    </div>
  );
};

export default EmptyCart;
