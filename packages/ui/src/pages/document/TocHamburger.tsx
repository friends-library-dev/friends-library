import React from 'react';
import cx from 'classnames';
import './TocHamburger.css';

const TocHamburger: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cx(className, `TocHamburger bg-white relative`)}>
      <i />
    </div>
  );
};

export default TocHamburger;
