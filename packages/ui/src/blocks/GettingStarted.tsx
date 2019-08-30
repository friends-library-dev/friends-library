import React from 'react';
import Heading from '../Heading';
import Button from '../Button';
import './GettingStarted.css';

const GettingStarted: React.FC = () => (
  <section className="GettingStarted px-6 overflow-hidden py-16 sm:p-16 md:pb-64 relative">
    <Wave fill="rgb(157, 157, 128)" viewBox="40 60 860 500" />
    <Wave fill="rgb(142, 142, 109)" viewBox="30 36 840 490" />
    <Wave fill="rgb(193, 193, 139)" viewBox="200 16 600 500" />
    <Bump fill="rgb(152, 200, 220)" viewBox="80 -250 1200 600" />
    <Bump fill="rgb(72, 105, 118)" viewBox="-0 -280 1010 600" />
    <Bump fill="rgb(98, 140, 157)" viewBox="-30 -330 1020 600" />
    <div className="z-10 relative">
      <Heading left={['md']} className="text-gray-900 md:text-left">
        Getting started
      </Heading>
      <p className="font-serif antialiased text-xl sm:text-2xl px-2 text-gray-700 leading-relaxed text-center md:text-left md:max-w-2xl">
        Not sure where to begin? We've got a bunch recommendations adapted to various
        states and interests to help guide you.
      </p>
      <Button className="bg-flmaroon mx-auto mt-10 md:mx-0">Get Started</Button>
    </div>
  </section>
);

export default GettingStarted;

const Wave: React.FC<{ fill: string; viewBox: string }> = ({ fill, viewBox }) => (
  <svg className="Wave" viewBox={viewBox} preserveAspectRatio="none">
    <path
      fill={fill}
      d="M 0 460 Q 60 390 170 390 Q 250 390 300 420 Q 400 480 500 470 Q 620 460 670 400 Q 740 320 700 180 Q 670 50 790 0 L 900 0 L 900 600 L 0 600 Z"
    />
  </svg>
);

const Bump: React.FC<{ fill: string; viewBox: string }> = ({ fill, viewBox }) => (
  <svg className="Bump" viewBox={viewBox} preserveAspectRatio="none">
    <path
      fill={fill}
      d="M 0 350 Q 180 250 450 230 Q 720 220 800 440 L 800 600 L 0 600 Z"
    />
  </svg>
);
