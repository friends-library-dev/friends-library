import React from 'react';
import Meta from './FriendMeta';
import Uk from '../../images/maps/UK--temp.png';
import Us from '../../images/maps/US--temp.png';
import Europe from '../../images/maps/Europe--temp.png';
import LocationMarker from '../../icons/LocationMarker';
import './MapBlock.css';

interface Props {
  friendName: string;
  residences: string[];
  map: 'UK' | 'US' | 'Europe';
  markers: {
    label: string;
    top: number;
    left: number;
  }[];
}

const MapBlock: React.FC<Props> = ({ friendName, markers, residences, map }) => (
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
          {markers
            .filter(m => m.top > 0)
            .map(m => (
              <LocationMarker key={m.label} top={m.top} left={m.left} label={m.label} />
            ))}
          {map === 'UK' && <img src={Uk} alt="Map of U.K." />}
          {map === 'US' && <img src={Us} alt="Map of U.S." />}
          {map === 'Europe' && <img src={Europe} alt="Map of Europe." />}
        </div>
      </div>
    </div>
  </div>
);

export default MapBlock;
