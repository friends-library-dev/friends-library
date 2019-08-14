import React from 'react';
import Heading from '../Heading';
import Button from '../Button';

const GettingStarted: React.FC = () => (
  <section className="p-16 md:pb-64">
    <Heading left={['md']} className="text-gray-900 md:text-left">
      Getting started
    </Heading>
    <p className="font-serif antialiased text-2xl text-gray-700 leading-relaxed text-center md:text-left md:max-w-2xl">
      Not sure where to begin? We've got a bunch recommendations adapted to various states
      and interests to help guide you.
    </p>
    <Button className="bg-flmaroon mx-auto mt-10 md:mx-0">Get Started</Button>
  </section>
);

export default GettingStarted;
