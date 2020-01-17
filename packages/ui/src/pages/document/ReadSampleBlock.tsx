import React from 'react';
import { Heading } from '@friends-library/types';
import DocActions from './DocActions';
import Tablet from './Tablet';
import TocHamburger from './TocHamburger';
import SampleToc from './SampleToc';
import './ReadSampleBlock.css';

interface Props {
  price: number;
  hasAudio: boolean;
  chapters: Heading[];
}

const ReadSampleBlock: React.FC<Props> = ({ price, hasAudio, chapters }) => {
  return (
    <section className="ReadSampleBlock relative p-10">
      <div className="z-20 relative">
        <div className="bg-white p-8 md:hidden">
          <FakeInnerds price={price} hasAudio={hasAudio} />
        </div>
        <h2 className="hidden md:block text-4xl mt-6 mb-12 text-white font-bold tracking-wider antialiased text-center">
          Read a Sample
        </h2>
        <div className="hidden md:flex flex-col items-center lg:justify-center lg:flex-row lg:items-stretch">
          <Tablet className="">
            <FakeInnerds price={price} hasAudio={hasAudio} />
          </Tablet>
          <div className="flex flex-col items-start hidden lg:flex">
            <TocHamburger className="mt-48" />
            <SampleToc
              className="mt-12 hidden xl:block"
              onClose={() => {}}
              chapters={chapters}
            />
          </div>
        </div>
      </div>
      <div className="bg absolute bg-black inset-0 md:inset-auto md:top-0 md:left-0 md:right-0 z-10 overflow-hidden">
        <div className="z-20 absolute inset-0 opacity-50" />
      </div>
    </section>
  );
};

export default ReadSampleBlock;

const FakeInnerds: React.FC<{ price: number; hasAudio: boolean }> = ({
  price,
  hasAudio,
}) => {
  return (
    <div className="SampleContent md:py-6 md:px-8">
      <h3 className="font-sans text-center text-3xl tracking-wide mb-4">Book Sample</h3>
      <h4 className="font-sans text-center text-xl mb-4">
        Chapter 1: This is a Sub Heading
      </h4>
      <p className="leading-loose antialiased mb-4">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis mollitia earum
        quibusdam. Soluta aperiam cupiditate dignissimos aspernatur non nisi magnam
        tempora nobis debitis voluptates, necessitatibus incidunt vitae quam pariatur
        adipisci!
      </p>
      <p className="leading-loose antialiased mb-4">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis mollitia earum
        quibusdam. Soluta aperiam cupiditate dignissimos aspernatur non nisi magnam
        tempora nobis debitis voluptates, necessitatibus incidunt vitae quam pariatur
        adipisci!
      </p>
      <p className="leading-loose antialiased mb-4">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis mollitia earum
        quibusdam. Soluta aperiam cupiditate dignissimos aspernatur non nisi magnam
        tempora nobis debitis voluptates, necessitatibus incidunt vitae quam pariatur
        adipisci!
      </p>
      <DocActions
        download={() => console.log('@TODO @BLOCKER')}
        addToCart={() => console.log('@TODO @BLOCKER')}
        className="mt-8"
        price={price}
        hasAudio={hasAudio}
      />
    </div>
  );
};
