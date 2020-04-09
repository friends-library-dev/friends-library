import React from 'react';
import { t, Dual, Heading, Button } from '@friends-library/ui';
import BooksBgBlock from './BooksBgBlock';

const ExploreBooksBlock: React.FC<{ numTotalBooks: number }> = ({ numTotalBooks }) => (
  <BooksBgBlock>
    <Heading darkBg className="text-white">
      <Dual.frag>
        <>Explore Books</>
        <>Explorar Libros</>
      </Dual.frag>
    </Heading>
    <Dual.p className="font-serif text-white text-xl opacity-75 leading-loose max-w-3xl text-center mx-auto">
      <>
        We currently have {numTotalBooks} books available for free on this site. On our
        “Explore” page you can browse all the titles by edition, region, time period,
        tags, and more, or search the full library to find exactly what you’re looking
        for.
      </>
      <>
        Actualmente tenemos {numTotalBooks} libros disponibles de forma gratuita en este
        sitio, y se están traduciendo y añadiendo más regularmente. En nuestra página de
        “Explorar” puedes navegar a través de todos nuestros libros y audiolibros, o
        buscar libros en la categoría particular que más te interese.
      </>
    </Dual.p>
    <Button to={t`/explore`} className="mx-auto mt-12" shadow>
      <Dual.frag>
        <>Start Exploring</>
        <>Comenzar a Explorar</>
      </Dual.frag>
    </Button>
  </BooksBgBlock>
);

export default ExploreBooksBlock;
