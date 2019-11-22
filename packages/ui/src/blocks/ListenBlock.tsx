import React from 'react';
import MultiPill from '../MultiPill';
import Soundcloud from '../images/soundcloud.png';
import SoundcloudMobile from '../images/soundcloud-mobile.png';
import './ListenBlock.css';

const ListenBlock: React.FC = () => {
  return (
    <section className="ListenBlock px-0 overflow-hidden py-10 sm:p-16 relative">
      <Bump fill="rgb(152, 200, 220)" viewBox="100 -180 1200 600" />
      <Bump fill="rgb(72, 105, 118)" viewBox="-0 -180 1010 600" />
      <Bump fill="rgb(98, 140, 157)" viewBox="300 -245 1020 600" />
      <div className="z-10 relative">
        <h1 className="font-sans font-bold text-3xl text-center tracking-wider mb-8">
          Listen to the Book
        </h1>
        <div className="flex flex-row justify-center">
          <MultiPill
            className="ml-8 sm:ml-0"
            buttons={[{ text: 'Download Lo-Fi' }, { text: 'Download Hi-Fi' }]}
            inline
          />
          <a
            href="/"
            className="block mt-4 ml-2 w-6 h-6 text-center text-sm text-flprimary border border-solid rounded-full border-flprimary"
          >
            ?
          </a>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={SoundcloudMobile}
            alt=""
            className="md:hidden shadow-2xl mt-12 max-w-xs"
          />
          <img
            src={Soundcloud}
            alt=""
            className="hidden md:block shadow-2xl mt-12 max-w-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default ListenBlock;

const Bump: React.FC<{ fill: string; viewBox: string }> = ({ fill, viewBox }) => (
  <svg
    className="absolute bottom-0"
    style={{ height: '160%', width: '360%', left: '-20%' }}
    viewBox={viewBox}
    preserveAspectRatio="none"
  >
    <path
      fill={fill}
      d="M 30 300 Q 120 210 210 270 Q 315 330 420 240 Q 510 180 615 270 C 750 390 840 210 930 315 C 1005 405 1140 285 1200 255 L 1200 600 L 15 600 Z"
    />
  </svg>
);
