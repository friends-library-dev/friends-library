import React from 'react';
import { CoverProps } from '@friends-library/types';
import { wrapClasses } from './css/helpers';
import Back from './Back';
import FrontInner from './FrontInner';
import Spine from './Spine';

const PrintPdf: React.FC<CoverProps> = props => {
  return (
    <div
      className={wrapClasses(props, {
        'Cover--pdf': true,
        browser: typeof window !== 'undefined',
      })}
    >
      <div className="print-pdf">
        <Back {...props} />
        <Spine {...props} />
        <FrontInner {...props} />
      </div>
      {props.showGuides && (
        <>
          <div className="guide guide--spine guide--vertical guide--spine-left" />
          <div className="guide guide--spine guide--vertical guide--spine-right" />
        </>
      )}
    </div>
  );
};

export default PrintPdf;
