import React from 'react';
import DuoToneWaveBlock from '../../blocks/DuoToneWaveBlock';
import Heading from '../../Heading';
import Button from '../../Button';

const GettingStartedBlock: React.FC = () => (
  <DuoToneWaveBlock className="px-6 py-16 sm:p-16 md:pb-64">
    <Heading left={['md']} className="text-gray-900 md:text-left">
      Getting started
    </Heading>
    <p className="font-serif antialiased text-xl sm:text-2xl px-2 text-gray-700 leading-relaxed text-center md:text-left md:max-w-2xl">
      Not sure where to begin? We've got a bunch recommendations adapted to various states
      and interests to help guide you.
    </p>
    <Button to="/getting-started" className="bg-flmaroon mx-auto mt-10 md:mx-0">
      Get Started
    </Button>
  </DuoToneWaveBlock>
);

export default GettingStartedBlock;
