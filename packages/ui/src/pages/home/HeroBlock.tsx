import React from 'react';
import './HeroBlock.css';

const HeroBlock: React.FC = () => (
  <section className="HeroBlock flex w-full">
    <div className="HeroBlock__text md:w-2/3 xl:w-3/5 px-12 sm:px-16 py-12 sm:py-20 md:px-20 lg:p-24 text-white md:text-gray-900">
      <h1 className="font-sans text-2xl sm:text-3xl mb-8 md:mb-6 font-bold tracking-wider">
        Dedicated to the preservation and free distribution of early Quaker writings
      </h1>
      <p className="font-serif text-lg sm:text-xl md:text-gray-800 leading-relaxed antialiased">
        This website exists to freely share the writings of early members of the Religious
        Society of Friends (Quakers), believing that no other collection of Christian
        writings more accurately communicates or powerfully illustrates the
        soul-transforming power of the gospel of Jesus Christ.
      </p>
    </div>
    <div className="HeroBlock__bg md:w-1/3 xl:w-2/5 hidden md:block" />
  </section>
);

export default HeroBlock;