import React from 'react';
import { CoverProps } from '@friends-library/types';
import { wrapClasses } from './css/helpers';
import FrontInner from './FrontInner';

const CoverFront: React.FC<CoverProps> = props => {
  return (
    <div className={wrapClasses(props)}>
      <FrontInner {...props} />
    </div>
  );
};

export default CoverFront;
