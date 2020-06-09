import React from 'react';
import cx from 'classnames';
import map from '../../images/full_map.png';
import LocationMarker from '../../icons/LocationMarker';
import { Region } from './types';
import './SelectableMap.css';

interface Props {
  selectedRegion: string;
  selectRegion: (region: Region) => any;
  className?: string;
  style?: Record<string, number | string>;
}

const SelectableMap: React.FC<Props> = ({
  selectedRegion,
  selectRegion,
  className,
  style = {},
}) => {
  return (
    <div className={cx(className, `SelectableMap relative`)} style={style}>
      <LocationMarker
        className={selectedRegion === `Eastern US` ? `selected` : ``}
        onClick={selectRegion}
        label="Eastern US"
        top={64.0}
        left={17.5}
      />
      <LocationMarker
        className={selectedRegion === `Western US` ? `selected` : ``}
        onClick={selectRegion}
        label="Western US"
        top={62}
        left={11}
      />
      <LocationMarker
        className={selectedRegion === `England` ? `selected` : ``}
        onClick={selectRegion}
        label="England"
        top={33}
        left={82.5}
      />
      <LocationMarker
        className={selectedRegion === `Ireland` ? `selected` : ``}
        onClick={selectRegion}
        label="Ireland"
        top={29.8}
        left={76.1}
      />
      <LocationMarker
        className={selectedRegion === `Scotland` ? `selected` : ``}
        onClick={selectRegion}
        label="Scotland"
        top={20}
        left={79.5}
      />
      <img src={map} alt="Map." className="" />
    </div>
  );
};

export default SelectableMap;
