import React from 'react';
import Audio from '../../icons/Audio';
import Rotate from '../../icons/Rotate';
import Button from '../../Button';

interface Props {
  description: string;
  hasAudio: boolean;
  url: string;
}

const SearchResultBack: React.FC<Props> = ({ description, hasAudio, url }) => {
  return (
    <div className="px-8 py-10 bg-flblue text-white">
      <p className="body-text text-white text-base leading-loose text-justify">
        {description}
      </p>
      {hasAudio && (
        <p className="font-sans uppercase text-center text-sm py-6 flex justify-center items-center tracking-wider">
          <Audio height={22} tailwindColor="white" className="mr-2" />
          <span>Audio Book</span>
        </p>
      )}
      <Button to={url} bg={null} className="bg-white" textColor="gray-700">
        View Book
      </Button>
      <button className="mx-auto mt-4 block focus:outline-none subtle-focus">
        <Rotate tailwindColor="white" />
      </button>
    </div>
  );
};

export default SearchResultBack;
