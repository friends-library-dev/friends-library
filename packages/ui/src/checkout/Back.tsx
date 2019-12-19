import React from 'react';
import cx from 'classnames';

const Back: React.FC<{ className?: string }> = ({ children, className }) => {
  return (
    <button
      tabIndex={-1}
      style={{ fontSize: '0.665rem' }}
      className={cx(className, 'uppercase bold text-gray-500 mb-6 mt-0 block')}
    >
      &lsaquo; {children}
    </button>
  );
};

export default Back;
