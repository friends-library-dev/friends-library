import React from 'react';
import Link from 'gatsby-link';
import Button from '../../Button';
import './CompilationsBlock.css';

const CompilationsBlock: React.FC = () => (
  <div className="CompilationsBlock text-center text-white px-16 py-24 md:py-24 xl:py-32">
    <h1 className="sans-wider text-4xl font-bold">Compilations</h1>
    <p className="body-text text-white py-8 text-lg leading-loose max-w-screen-sm mx-auto">
      We also have a number of books comprised of the writings of more than one author.
      Some of these were compiled and published during the time of the early Friends, and
      some were compiled recently by the editors of this website. Among the latter is{' '}
      <Link
        to="/compilations/truth-in-the-inward-parts"
        className="subtle-link text-white"
      >
        Truth in the Inward Parts
      </Link>
      , a work containing extracts from the journals and letters of 10 early friends
      describing their convincement and spiritual growth.
    </p>
    <Button to="/compilations" className="mt-4 mx-auto">
      View Compilations &rarr;
    </Button>
  </div>
);

export default CompilationsBlock;
