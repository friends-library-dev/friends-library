import React from 'react';
import Heading from '../Heading';
import Button from '../Button';
import './ExploreBooks.css';

const ExploreBooks: React.FC = () => (
  <section className="ExploreBooks py-32 px-16 bg-black">
    <Heading darkBg className="text-white">
      Explore Books
    </Heading>
    <p className="font-serif text-white text-xl opacity-75 leading-loose max-w-3xl text-center mx-auto">
      We currently have 113 books freely availble on this site. We'll help you find what
      you're looking for by searching, browsing authors, topics, genres, and more.
    </p>
    <Button className="bg-flmaroon mx-auto mt-12">Explore More</Button>
  </section>
);

export default ExploreBooks;
