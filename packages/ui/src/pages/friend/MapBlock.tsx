import React from 'react';
import Meta from './FriendMeta';
import Europe from '../../images/maps/europe.png';
import './MapBlock.css';

interface Props {
  friendName: string;
  abodes: string[];
}

const MapBlock: React.FC<Props> = ({ friendName, abodes }) => {
  return (
    <div className="MapBlock relative bg-cover pb-20 md:pb-32 xl:pb-64">
      <div className="relative items-start justify-center xl:flex xl:bg-flgray-100 xl:mx-auto xl:mt-12 xl:py-10">
        <Meta
          className="mx-6 z-10 max-w-xs md:mt-8 xl:w-64 xl:py-24"
          title={`Where did ${friendName} live?`}
          color="maroon"
        >
          {abodes.map(abode => (
            <li>{abode}</li>
          ))}
        </Meta>
        <div className="bg-white py-6 md:py-12 md:px-8 lg:px-32 xl:bg-flgray-100 xl:p-0">
          <img src={Europe} alt="Map of Europe." />
        </div>
      </div>
    </div>
  );
};

export default MapBlock;
