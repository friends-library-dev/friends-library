import React from 'react';
import Meta from './FriendMeta';
import Uk from '../../images/maps/united_kingdom.png';
import LocationMarker from '../../icons/LocationMarker';
import './MapBlock.css';

interface Props {
  friendName: string;
  residences: string[];
  markers: {
    label: string;
    top: number;
    left: number;
  }[];
}

const MapBlock: React.FC<Props> = ({ friendName, residences, markers }) => {
  return (
    <div className="MapBlock relative bg-cover pb-20 md:pb-32 xl:pb-64">
      <div className="relative items-start justify-center xl:flex xl:bg-flgray-100 xl:mx-auto xl:mt-12 xl:py-10">
        <Meta
          className="mx-6 z-10 max-w-xs md:mt-8 xl:w-64 xl:py-24"
          title={`Where did ${friendName} live?`}
          color="maroon"
        >
          {residences.map(residence => (
            <li key={residence}>{residence}</li>
          ))}
        </Meta>
        <div className="bg-white py-6 md:py-12 md:px-8 lg:px-32 xl:bg-flgray-100 xl:p-0">
          <div className="relative">
            {markers.map(m => (
              <LocationMarker key={m.label} top={m.top} left={m.left} label={m.label} />
            ))}
            <img src={Uk} alt="Map of UK." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapBlock;
