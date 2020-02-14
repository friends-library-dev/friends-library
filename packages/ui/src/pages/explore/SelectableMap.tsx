import React from 'react';
import cx from 'classnames';
import map from '../../images/full_map.png';
import LocationMarker from '../../icons/LocationMarker';
import './SelectableMap.css';

interface Props {
  selectedRegion: string;
  selectRegion: (region: string) => any;
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
    <div className={cx(className, 'SelectableMap relative')} style={style}>
      <LocationMarker
        className={selectedRegion === 'Southern US' ? 'selected' : ''}
        onClick={selectRegion}
        label="Southern US"
        top={75.5}
        left={12.5}
      />
      <LocationMarker
        className={selectedRegion === 'Northern US' ? 'selected' : ''}
        onClick={selectRegion}
        label="Northern US"
        top={65}
        left={16}
      />
      <LocationMarker
        className={selectedRegion === 'England' ? 'selected' : ''}
        onClick={selectRegion}
        label="England"
        top={33}
        left={82.5}
      />
      <LocationMarker
        className={selectedRegion === 'Ireland' ? 'selected' : ''}
        onClick={selectRegion}
        label="Ireland"
        top={29.8}
        left={76.1}
      />
      <LocationMarker
        className={selectedRegion === 'Scotland' ? 'selected' : ''}
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
