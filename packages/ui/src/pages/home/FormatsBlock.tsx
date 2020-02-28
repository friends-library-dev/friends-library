import React from 'react';
import Link from 'gatsby-link';
import Heading from '../../Heading';
import Books from '../../images/formats-books.png';
import BooksMobile from '../../images/formats-books-mobile.png';
import './FormatsBlock.css';

const FormatsBlock: React.FC = () => (
  <section className="FormatsBlock py-16 px-12 relative xl:pl-24 xl:py-24">
    <Heading left={['md']} className="text-gray-900 md:text-left">
      Formats &amp; Editions
    </Heading>
    <div className="hidden md:block BookMask--lg"></div>
    <div className="md:hidden BookMask--sm"></div>
    <p className="font-serif antialiased text-lg sm:text-xl text-gray-700 leading-relaxed">
      On this site you will find many books available in multiple formats. Our desire is
      to make these precious writings as accessible as possible to the modern seeker after
      truth&mdash;therefore, each book has been converted to 3 digital formats: pdf, mobi
      (for Kindle), and epub (all other e-readers including iBooks). A growing number of
      our books also have an{' '}
      <Link to="/audiobooks" className="subtle-link">
        audiobook version
      </Link>
      . In addition to these formats, all of which are 100% free to download, any of our
      books may be ordered <em>at cost</em> as a paperback edition.
    </p>
    <p className="mt-8 font-serif antialiased text-lg sm:text-xl text-gray-700 leading-relaxed">
      In addition to the various formats of the book, we also offer minimally and
      carefully modernized versions of each book, because most modern readers find some of
      the antiquated grammer and vocabulary to be a stumbling block to comprehension. For
      more info on modernization,{' '}
      <Link to="/modernization" className="subtle-link">
        click here
      </Link>
      .
    </p>
    <img className="Books--lg hidden md:block" src={Books} alt="" />
    <img className="Books--sm md:hidden" src={BooksMobile} alt="" />
  </section>
);

export default FormatsBlock;
