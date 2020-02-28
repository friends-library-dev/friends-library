import React from 'react';
import Heading from '../../Heading';
import Devices from '../../images/device-array.png';
import Cover from '../../images/samuel-fothergill-cover.jpg';
import iPhone from '../../images/iphone.png';
import iPad from '../../images/ipad.png';
import './SubHeroBlock.css';

const SubHeroBlock: React.FC<{ numTotalBooks: number }> = ({ numTotalBooks }) => (
  <section className="SubHeroBlock bg-flprimary p-10 pb-48 relative overflow-hidden md:px-20 lg:px-24 md:pt-20 md:pb-2 md:overflow-visible xl:py-20">
    <img
      className="Devices absolute right-0 top-0 hidden md:block"
      src={Devices}
      alt="Friends Library books on various devices"
    />
    <Heading darkBg className="text-white md:hidden">
      Our Books
    </Heading>
    <p className="font-serif text-white antialiased text-lg sm:text-xl leading-relaxed md:w-2/3 lg:w-4/5 lg:pr-24 md:pr-8 xl:text-2xl xl:max-w-6xl xl:mb-16">
      Our {numTotalBooks} books are available for free download in multiple editions and
      digital formats, and a growing number of them are also recorded as audiobooks. Or,
      if you prefer, order a paperback — you pay only and exactly what it costs us to have
      them printed and shipped to you.
    </p>
    <ul className="flex flex-wrap font-sans text-white uppercase tracking-wider mt-8 mb-12 justify-center antialiased md:justify-start">
      <li className="Format Format--audio">Audiobooks</li>
      <li className="Format Format--paperback">Paperbacks</li>
      <li className="Format Format--ebook">E-Books</li>
    </ul>
    <img className="Paperback absolute md:hidden" src={Cover} alt="" />
    <img className="iPhone absolute shadow-xl md:hidden" src={iPhone} alt="" />
    <img className="iPad absolute shadow-xl md:hidden" src={iPad} alt="" />
  </section>
);

export default SubHeroBlock;
