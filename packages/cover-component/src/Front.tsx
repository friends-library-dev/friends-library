import React from 'react';
import { CoverProps } from '@friends-library/types';
import { wrapClasses } from './css/helpers';
import FrontInner from './FrontInner';

type Props = Omit<CoverProps, 'blurb' | 'pages'> & {
  className?: string;
};

const CoverFront: React.FC<Props> = props => {
  return (
    <div className={wrapClasses(props, props.className || '')}>
      <FrontInner {...props} />
    </div>
  );
};

export default CoverFront;
