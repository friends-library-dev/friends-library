import React from 'react';
import { CoverProps } from '@friends-library/types';
import { wrapClasses } from './css/lib/helpers';
import Back from './Back';
import Front from './Front';
import Spine from './Spine';

const PrintPdf: React.FC<CoverProps> = props => {
  return (
    <div className={wrapClasses(props)}>
      <div className="print-pdf">
        <Back {...props} />
        <Spine {...props} />
        <Front {...props} />
      </div>
    </div>
  );
};

export default PrintPdf;
