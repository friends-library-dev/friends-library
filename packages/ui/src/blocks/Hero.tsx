import React from 'react';
import './Hero.css';

const Hero: React.FC = () => (
  <section className="Hero flex w-full">
    <div className="Hero__text md:w-2/3 xl:w-3/5 px-16 py-24 md:px-24 text-white md:text-gray-900">
      <h1 className="font-sans text-3xl mb-8 md:mb-6 font-bold tracking-wider">
        Dedicated to the preservation and free distribution of early Quaker writings
      </h1>
      <p className="font-serif text-xl md:text-gray-800 leading-relaxed antialiased">
        This website exists to freely share the writings of early members of the Religious
        Society of Friends (Quakers), believing that no other collection of Christian
        writings more accurately communicates or powerfully illustrates the
        soul-transforming power of the gospel of Jesus Christ.
      </p>
    </div>
    <div className="Hero__bg md:w-1/3 xl:w-2/5 hidden md:block" />
  </section>
);

export default Hero;
