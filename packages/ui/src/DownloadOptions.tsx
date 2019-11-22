import React from 'react';
import './DownloadOptions.css';

const DownloadOptions: React.FC = () => {
  return (
    <div className="DownloadOptions bg-white py-10 px-20 tracking-widest uppercase antialiased rounded-lg shadow-direct relative">
      <dl>
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
    </div>
  );
};

export default DownloadOptions;
