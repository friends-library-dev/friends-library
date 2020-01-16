import React from 'react';
import MultiPill from '../MultiPill';
import Soundcloud from '../images/soundcloud.png';
import SoundcloudMobile from '../images/soundcloud-mobile.png';
import WaveBottomBlock from './WaveBottomBlock';

const ListenBlock: React.FC = () => {
  return (
    <WaveBottomBlock color="blue" className="bg-flgray-100 px-0 py-10 sm:p-16">
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
    </WaveBottomBlock>
  );
};

export default ListenBlock;
