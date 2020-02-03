import React, { useState, useEffect } from 'react';
import Link from 'gatsby-link';
import { AudioQuality } from '@friends-library/types';
import EmbeddedAudio from '../../EmbeddedAudio';
import WaveBottomBlock from '../../blocks/WaveBottomBlock';
import QualitySwitch from './QualitySwitch';
import './ListenBlock.css';

interface CommonProps {
  m4bFilesizeLq: string;
  m4bFilesizeHq: string;
  mp3ZipFilesizeLq: string;
  mp3ZipFilesizeHq: string;
  m4bUrlLq: string;
  m4bUrlHq: string;
  mp3ZipUrlLq: string;
  mp3ZipUrlHq: string;
  podcastUrlLq: string;
  podcastUrlHq: string;
}

type Props = CommonProps & {
  title: string;
  trackIdLq: number;
  trackIdHq: number;
  numAudioParts: number;
  playlistIdLq?: number | null;
  playlistIdHq?: number | null;
};

const ListenBlock: React.FC<Props> = props => {
  const [quality, setQuality] = useState<AudioQuality>('HQ');
  const {
    trackIdLq,
    trackIdHq,
    numAudioParts,
    playlistIdLq,
    playlistIdHq,
    title,
  } = props;

  useEffect(() => {
    // @ts-ignore
    if (window.navigator?.connection?.downlink < 2.5) {
      setQuality('LQ');
    }
  }, []);

  return (
    <WaveBottomBlock
      color="blue"
      className="ListenBlock bg-flgray-100 px-8 py-10 sm:p-16"
    >
      <h3 className="font-sans font-bold text-3xl tracking-wider mb-8 fl-underline text-flprimary">
        Download Audiobook
      </h3>
      <div className="text-center mb-8 -mt-4 sm:absolute top-0 right-0 sm:mt-2 pt-1">
        <QualitySwitch quality={quality} onChange={setQuality} />
      </div>
      <DownloadLinks {...props} quality={quality} />
      <h3 className="font-sans font-bold text-3xl tracking-wider mb-8 fl-underline text-flprimary">
        <span className="italic lowercase font-serif font-normal pr-1">Or</span> Listen
        Online
      </h3>
      <div className="flex flex-col items-center shadow-xl mt-8 mx-6">
        <EmbeddedAudio
          trackId={quality === 'HQ' ? trackIdHq : trackIdLq}
          playlistId={quality === 'HQ' ? playlistIdHq : playlistIdLq}
          height={
            playlistIdLq
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

type DownloadProps = CommonProps & {
  quality: AudioQuality;
};

const DownloadLinks: React.FC<DownloadProps> = props => {
  let links = {
    mp3Zip: props.mp3ZipUrlHq,
    zipSize: props.mp3ZipFilesizeHq,
    m4b: props.m4bUrlHq,
    m4bSize: props.m4bFilesizeHq,
    podcast: props.podcastUrlHq,
  };
  if (props.quality === 'LQ') {
    links = {
      mp3Zip: props.mp3ZipUrlLq,
      zipSize: props.mp3ZipFilesizeLq,
      m4b: props.m4bUrlLq,
      m4bSize: props.m4bFilesizeLq,
      podcast: props.podcastUrlLq,
    };
  }
  return (
    <div className="DownloadLinks sm:pl-8 tracking-widest uppercase antialiased flex flex-col items-center sm:block -mx-16 -mt-4 px-8 sm:pl-16">
      <dl className="text-flgray-900 inline-block bg-flgray-100 py-6 px-10 -mx-4">
        <dt className="font-bold text-md mb-1">
          <a href={links.podcast} className="hover:underline">
            <span className="hidden sm:inline">Download as </span>podcast
          </a>
          <span className="text-xs bg-flblue text-white rounded-full -mt-1 ml-4 px-4 py-1">
            Recommended
          </span>
        </dt>
        <dd className="text-gray-500 text-xs mb-4 pb-1">
          (Apple Podcasts, Stitcher, <span className="hidden sm:inline">Overcast, </span>
          etc.)
        </dd>
        <dt className="font-bold text-md mb-1">
          <a href={links.mp3Zip} className="hover:underline">
            Download mp3 Files as Zip ({links.zipSize})
          </a>
        </dt>
        <dd className="text-gray-500 text-xs mb-4 pb-1">
          (use in iTunes, or any music app)
        </dd>
        <dt className="font-bold text-md mb-1">
          <a href={links.m4b} className="hover:underline">
            Download .M4B Audiobook <span className="hidden sm:inline">File</span> (
            {links.m4bSize})
          </a>
        </dt>
        <dd className="text-gray-500 text-xs mb-4 pb-1">
          (audiobook format for <span className="hidden sm:inline">Books app, </span>
          iTunes, etc.)
        </dd>
        <dt className="ml-8 mt-8 mb-6 italic text-sm text-right">
          <Link to="/audio-help" className="hover:underline">
            <i className="fa fa-question-circle pr-1 text-flblue-700" />
            Audio Download Help &rarr;
          </Link>
        </dt>
      </dl>
    </div>
  );
};
