import React from 'react';
import Heading from '../Heading';

const SubHero: React.FC = () => (
  <section className="Subhero bg-flprimary p-10 pb-16">
    <Heading darkBg className="text-white">
      Our Books
    </Heading>
    <p className="font-serif text-white antialiased text-xl leading-relaxed max-w-xl mx-auto">
      Our 113 books are available for free download in multiple editions and digital
      formats, and a growing number of them are also recorded as audiobooks. Or, if you
      prefer, order a paperback — you pay only and exactly what it costs us to have them
      printed and shipped to you.
    </p>
  </section>
);

export default SubHero;
