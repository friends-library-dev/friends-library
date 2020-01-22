import React from 'react';
import MultiPill from '../../MultiPill';
import EmbeddedAudio from '../../EmbeddedAudio';
import WaveBottomBlock from '../../blocks/WaveBottomBlock';

interface Props {
  title: string;
  trackId: number;
  numAudioParts: number;
  playlistId?: number | null;
}

const ListenBlock: React.FC<Props> = ({ trackId, numAudioParts, playlistId, title }) => {
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
      <div className="flex flex-col items-center shadow-xl mt-8 mx-6">
        <EmbeddedAudio
          trackId={trackId}
          playlistId={playlistId}
          height={
            playlistId
              ? SC_MAIN_SECTION_HEIGHT +
                SC_FOOTER_HEIGHT +
                SC_TRACK_HEIGHT * numAudioParts
              : SC_MAIN_SECTION_HEIGHT
          }
          title={title}
        />
      </div>
    </WaveBottomBlock>
  );
};

export default ListenBlock;

const SC_MAIN_SECTION_HEIGHT = 165;
const SC_FOOTER_HEIGHT = 55;
const SC_TRACK_HEIGHT = 31;
