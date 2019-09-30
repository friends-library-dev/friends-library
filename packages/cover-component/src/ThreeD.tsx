import React from 'react';
import { CoverProps } from '@friends-library/types';
import { wrapClasses } from './css/lib/helpers';
import Back from './Back';
import FrontInner from './FrontInner';
import Spine from './Spine';

const ThreeD: React.FC<CoverProps> = props => {
  return (
    <div className={wrapClasses(props, 'Cover--3d')}>
      <div className="box">
        <Back {...props} />
        <Spine {...props} />
        <FrontInner {...props} />
        <div className="top" />
        <div className="right" />
        <div className="bottom" />
      </div>
    </div>
  );
};

export default ThreeD;
