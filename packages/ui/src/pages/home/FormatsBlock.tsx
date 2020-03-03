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
      to make these precious writings as accessible as possible to today&rsquo;s seeker of
      truth&mdash;therefore, each book has been converted to 3 digital formats: pdf, mobi
      (for Kindle), and epub (all other e-readers including Apple Books). A growing number
      of our books are also available{' '}
      <Link to="/audiobooks" className="subtle-link">
        as audiobooks
      </Link>
      . And in addition to these formats (which are 100% free to download), paperback
      books are available <em>at cost</em> for every title offered on our site.
    </p>
    <p className="mt-8 font-serif antialiased text-lg sm:text-xl text-gray-700 leading-relaxed">
      Besides offering these books in digital, audio, and printed <em>formats,</em> most
      of these publications are available in different <em>editions</em> as well. We offer
      an original, unedited edition for those who enjoy the archaic language and style.
      But because most readers find the older English somewhat challenging, we offer
      minimally and carefully modernized editions as well. For more information{' '}
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
