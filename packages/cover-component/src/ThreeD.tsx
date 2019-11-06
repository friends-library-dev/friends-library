import React from 'react';
import { CoverProps } from '@friends-library/types';
import { wrapClasses } from './css/helpers';
import Back from './Back';
import FrontInner from './FrontInner';
import Spine from './Spine';

type Props = CoverProps & {
  perspective?: 'back' | 'front' | 'spine' | 'angle-front' | 'angle-back';
};

const ThreeD: React.FC<Props> = props => {
  return (
    <div
      className={wrapClasses(props, [
        'Cover--3d',
        `perspective--${props.perspective || 'angle-front'}`,
      ])}
    >
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
