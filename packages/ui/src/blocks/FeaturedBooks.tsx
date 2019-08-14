import React from 'react';
import Heading from '../Heading';
import Button from '../Button';
import Cover from '../images/cover.jpg';
import './FeaturedBooks.css';

const FeaturedBooks: React.FC = () => (
  <section className="FeaturedBooks p-20">
    <Heading className="text-gray-800">Featured Books</Heading>
    <div className="Book md:flex">
      <div className="md:w-2/5 md:mr-16">
        <img
          className="shadow-xl w-3/5 mx-auto mb-12 md:w-auto"
          src={Cover}
          alt="Paperback cover"
        />
      </div>
      <div className="Text md:w-3/5">
        <h2 className="font-sans text-gray-800 text-2xl mb-4 leading-relaxed tracking-wider font-bold">
          The Life and Letters of Samuel Fothergill
        </h2>
        <p className="font-sans uppercase text-gray-800 text-lg tracking-widest font-black mb-6">
          Modernized Edition
        </p>
        <p className="font-serif text-xl opacity-75 leading-relaxed max-w-6xl">
          Samuel Fothergill (1715-1772) was the youngest son of eminent Quaker minister,
          John Fothergill. As a young man, Samuel yielded to various temptations, "giving
          way to the indulgence of his evil passions, and abandoning himself to the
          pursuit of folly and dissipation."
        </p>
        <p className="my-6">
          <em className="font-serif font-black text-lg antialiased pr-2">by:</em>{' '}
          <a
            href="/friend/samuel-fothergill"
            className="font-serif uppercase text-lg antialiased font-bold text-flblue"
          >
            [ Samuel Fothergill ]
          </a>
        </p>
        <Button className="bg-flblue mt-12 mx-auto md:mx-0">Download &rarr;</Button>
      </div>
    </div>
  </section>
);

export default FeaturedBooks;
