import React from 'react';
import cx from 'classnames';
import './Tablet.css';

const Tablet: React.FC<{ className?: string }> = ({ children, className = `` }) => {
  return (
    <div className={cx(className, `Tablet bg-white`)}>
      <i className="extra-camera" />
      <i className="top-btn" />
      <i className="side-btns" />
      <div className="Tablet--inner">{children}</div>
    </div>
  );
};

export default Tablet;
