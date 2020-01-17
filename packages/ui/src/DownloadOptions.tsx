import React from 'react';
import PopUnder from './PopUnder';

const DownloadOptions: React.FC = () => {
  return (
    <PopUnder className="bg-white py-10 px-20 tracking-widest uppercase antialiased">
      <dl className="text-flgray-900">
        <dt className="font-bold text-lg">Download .MP3</dt>
        <dd className="text-gray-500 text-xs mb-4">(works anywhere)</dd>
        <dt className="font-bold text-lg">Download .M4B</dt>
        <dd className="text-gray-500 text-xs mb-4">(Audible)</dd>
        <dt className="font-bold text-lg">Download Podcast</dt>
        <dd className="text-gray-500 text-xs mb-4">(Apple Podcasts)</dd>
        <dt className="font-bold text-lg">Download All</dt>
        <dd className="text-gray-500 text-xs mb-4">(all formats)</dd>
        <dt className="font-bold text-lg">Help</dt>
        <dd className="text-gray-500 text-xs">(Get help)</dd>
      </dl>
    </PopUnder>
  );
};

export default DownloadOptions;
