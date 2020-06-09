import React from 'react';
import { CoverProps } from '@friends-library/types';
import { wrapClasses } from './css/helpers';
import Back from './Back';
import FrontInner from './FrontInner';
import Spine from './Spine';

type Props = CoverProps & {
  bleed?: boolean;
};

const PrintPdf: React.FC<Props> = props => {
  return (
    <div
      id={`Cover--${props.isbn}`}
      className={wrapClasses(props, {
        'Cover--pdf': true,
        'Cover--pdf--bleed': props.bleed !== false,
        browser: typeof window !== `undefined`,
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
