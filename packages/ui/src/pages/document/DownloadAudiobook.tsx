import React from 'react';
import cx from 'classnames';
import { AudioQuality } from '@friends-library/types';
import Link from 'gatsby-link';
import QualitySwitch from './QualitySwitch';
import Stack from '../../layout/Stack';

interface Props {
  className?: string;
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
  quality: AudioQuality;
  setQuality: (quality: AudioQuality) => any;
}

const DownloadLinks: React.FC<Props> = props => {
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
    <div className={cx(props.className, 'bg-white font-sans p-8')}>
      <h3 className="text-2xl text-center mb-6">Download Audiobook</h3>
      <div className="tracking-widest antialiased flex flex-col items-center">
        <dl className="text-flgray-900 inline-block">
          <dt className="uppercase text-md mb-1">
            <a href={links.podcast} className="hover:underline">
              <span className="hidden sm:inline">Download as </span>Podcast
            </a>
            <span className="text-xs normal-case bg-flprimary text-white rounded-full -mt-1 ml-4 px-6 py-1">
              Recommended
            </span>
          </dt>
          <dd className="text-flgray-500 text-xs mb-4 pb-1">
            (Apple Podcasts, Stitcher,{' '}
            <span className="hidden sm:inline">Overcast, </span>
            etc.)
          </dd>
          <dt className="uppercase text-md mb-1">
            <a href={links.mp3Zip} className="hover:underline">
              Download mp3 Files as Zip -{' '}
              <span className="text-flprimary">({links.zipSize})</span>
            </a>
          </dt>
          <dd className="text-flgray-500 text-xs mb-4 pb-1">
            (use in iTunes, or any music app)
          </dd>
          <dt className="uppercase text-md mb-1">
            <a href={links.m4b} className="hover:underline">
              Download .M4B Audiobook <span className="hidden sm:inline">File</span> -{' '}
              <span className="text-flprimary">({links.m4bSize})</span>
            </a>
          </dt>
          <dd className="text-flgray-500 text-xs mb-4 pb-1">
            (Audiobook format for <span className="hidden sm:inline">Apple Books, </span>
            iTunes, etc.)
          </dd>
        </dl>
      </div>
      <Stack space="6" className="flex flex-col items-center mt-6 mb-4">
        <QualitySwitch key="switch" quality={props.quality} onChange={props.setQuality} />
        <p key="text" className="text-flgray-500 text-base antialiased tracking-wider">
          (
          {props.quality === 'HQ'
            ? 'Higher quality, larger file size'
            : 'Lower quality, faster download'}
          )
        </p>
        <Link
          key="help"
          className="text-flprimary text-sm tracking-wider"
          to="/audio-help"
        >
          <span className="fl-underline">Need Help?</span>{' '}
          <i className="fa fa-life-ring opacity-75 pl-1" />
        </Link>
      </Stack>
    </div>
  );
};

export default DownloadLinks;
