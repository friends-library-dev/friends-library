import React from 'react';
import MultiBookBgBlock from '../../blocks/MultiBookBgBlock';
import Heading from '../../Heading';
import Button from '../../Button';

const ExploreBooksBlock: React.FC = () => (
  <MultiBookBgBlock>
    <Heading darkBg className="text-white">
      Explore Books
    </Heading>
    <p className="font-serif text-white text-xl opacity-75 leading-loose max-w-3xl text-center mx-auto">
      We currently have 113 books freely availble on this site. We'll help you find what
      you're looking for by searching, browsing authors, topics, genres, and more.
    </p>
    <Button className="bg-flmaroon mx-auto mt-12">Explore More</Button>
  </MultiBookBgBlock>
);

export default ExploreBooksBlock;
