import React from 'react';
import MultiPill from '../../MultiPill';
import EmbeddedAudio from '../../EmbeddedAudio';
import WaveBottomBlock from '../../blocks/WaveBottomBlock';

interface Props {
  title: string;
  trackId: number;
  numAudioParts: number;
  playlistId?: number | null;
  m4bUrlLq: string;
  mp3ZipUrlLq: string;
  podcastUrlLq: string;
  m4bUrlHq: string;
  mp3ZipUrlHq: string;
  podcastUrlHq: string;
}

const ListenBlock: React.FC<Props> = ({
  trackId,
  numAudioParts,
  playlistId,
  title,
  m4bUrlHq,
  mp3ZipUrlHq,
  podcastUrlHq,
  m4bUrlLq,
  mp3ZipUrlLq,
  podcastUrlLq,
}) => {
  return (
    <WaveBottomBlock
      color="blue"
      className="ListenBlock bg-flgray-100 px-0 py-10 sm:p-16"
    >
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
      <div>
        <h3 className="text-lg font-sans flprimary mb-2">HI-FI Links (temp)</h3>
        <ul className="ml-4 text-sm font-serif text-flblue underline list-disc list-inside">
          <li>
            <a href={mp3ZipUrlHq}>Download MP3s as zip</a>
          </li>
          <li>
            <a href={m4bUrlHq}>Download M4B audiobook file</a>
          </li>
          <li>
            <a href={podcastUrlHq}>Download as Podcast</a>
          </li>
        </ul>
        <h3 className="text-lg font-sans flprimary mb-2 mt-4">LO-FI Links (temp)</h3>
        <ul className="ml-4 text-sm font-serif text-flblue underline list-disc list-inside">
          <li>
            <a href={mp3ZipUrlLq}>Download MP3s as zip</a>
          </li>
          <li>
            <a href={m4bUrlLq}>Download M4B audiobook file</a>
          </li>
          <li>
            <a href={podcastUrlLq}>Download as Podcast</a>
          </li>
        </ul>
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
