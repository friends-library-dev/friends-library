import React from 'react';
import MultiBookBgBlock from '../../blocks/MultiBookBgBlock';
import Heading from '../../Heading';
import Button from '../../Button';

const ExploreBooksBlock: React.FC<{ numTotalBooks: number }> = ({ numTotalBooks }) => (
  <MultiBookBgBlock>
    <Heading darkBg className="text-white">
      Explore Books
    </Heading>
    <p className="font-serif text-white text-xl opacity-75 leading-loose max-w-3xl text-center mx-auto">
      We currently have {numTotalBooks} books freely available on this site. On our
      "Explore" page you can browse all the titles by edition, region, time period, tags,
      and more, or search the full library to find exactly what you're looking for.
    </p>
    <Button to="/explore" className="mx-auto mt-12" shadow>
      Start Exploring
    </Button>
  </MultiBookBgBlock>
);

export default ExploreBooksBlock;
