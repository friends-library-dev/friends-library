import React, { useState } from 'react';
import cx from 'classnames';
import useInterval from 'use-interval';
import { Swipeable } from 'react-swipeable';
import { useWindowWidth } from '../../hooks/window-width';
import { SCREEN_MD } from '../../lib/constants';
import SelectableMap from './SelectableMap';
import { Region } from './types';
import './MapSlider.css';

interface Props {
  className?: string;
  region: Region;
  setRegion: (region: Region) => any;
}

const MapSlider: React.FC<Props> = ({ className, region, setRegion }) => {
  const winWidth = useWindowWidth();
  const [focus, setFocus] = useState<'UK' | 'US'>('UK');
  const [controlled, setControlled] = useState<boolean>(false);
  const toggleFocus: () => any = () => setFocus(focus === 'UK' ? 'US' : 'UK');

  useInterval(() => {
    if (winWidth < SCREEN_MD && !controlled) {
      toggleFocus();
    }
  }, 12000);

  return (
    <Swipeable
      onSwiped={({ dir }) => {
        if (['Right', 'Left'].includes(dir) && winWidth < SCREEN_MD) {
          setControlled(true);
          setFocus(dir === 'Right' ? 'US' : 'UK');
        }
      }}
      className={cx(
        className,
        'MapSlider relative overflow-hidden',
        `focus--${focus}`,
        winWidth < 0 && 'blur',
      )}
    >
      <SelectableMap
        style={position(focus, winWidth)}
        className="transition-all duration-700 ease-in-out md:transition-none md:-mt-8"
        selectedRegion={region}
        selectRegion={setRegion}
      />
      <i
        onClick={() => {
          toggleFocus();
          setControlled(true);
        }}
        className={cx(
          `fa absolute text-6xl text-white px-4 opacity-25 cursor-pointer md:hidden`,
          'transform -translate-y-1/2',
          {
            'fa-chevron-left left-0': focus === 'UK',
            'fa-chevron-right right-0': focus === 'US',
          },
        )}
      />
    </Swipeable>
  );
};

export default MapSlider;

function position(area: 'US' | 'UK', winWidth: number): Record<string, number | string> {
  if (winWidth >= SCREEN_MD) {
    return {};
  }
  if (area === 'US') {
    return DIMS.US;
  }
  return {
    left: (DIMS.imgWidth - winWidth + DIMS.UK.right) * -1,
  };
}

const DIMS = {
  imgWidth: 1200, // keep in sync with SelectableMap.css
  UK: {
    right: -60,
  },
  US: {
    left: -30,
  },
};
