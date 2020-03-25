import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { t } from '../../translation';
import { LANG } from '../../env';
import { AudioQuality } from '@friends-library/types';
import EmbeddedAudio from '../../EmbeddedAudio';
import WaveBottomBlock from '../../blocks/WaveBottomBlock';
import DownloadAudiobook from './DownloadAudiobook';

interface Props {
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
  title: string;
  trackIdLq: number;
  trackIdHq: number;
  numAudioParts: number;
  playlistIdLq?: number | null;
  playlistIdHq?: number | null;
}

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
      color="maroon"
      id="ListenBlock"
      className={cx(
        'ListenBlock z-10 bg-flgray-100 pt-8 pb-12 py-12',
        'sm:p-16 lg:flex items-start lg:p-0',
      )}
    >
      <DownloadAudiobook
        className="mb-8 sm:mb-16 lg:border lg:border-l-0 lg:-mt-12 lg:pt-12 lg:px-12 border-flgray-200"
        {...props}
        quality={quality}
        setQuality={setQuality}
      />
      <div className="flex-grow lg:ml-8 xl:max-w-screen-md xl:mx-auto">
        <h3
          className={cx(
            'text-2xl tracking-wide text-center my-6',
            'sm:mb-16 sm:text-black',
            'lg:mb-0 lg:text-left xl:pt-6',
            {
              'text-white': !playlistIdLq,
              'text-black': !!playlistIdLq,
            },
          )}
        >
          {LANG === 'en' && (
            <span className="italic lowercase font-serif font-normal pr-1">Or</span>
          )}
          {t`Listen online`}
        </h3>
        <div className="flex flex-col items-center shadow-xl mt-8 mx-6 sm:mb-8 lg:ml-0">
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
      </div>
    </WaveBottomBlock>
  );
};

export default ListenBlock;

const SC_MAIN_SECTION_HEIGHT = 165;
const SC_FOOTER_HEIGHT = 55;
const SC_TRACK_HEIGHT = 31;
