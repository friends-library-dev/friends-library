import React from 'react';
import cx from 'classnames';

interface Props {
  className?: string;
  onClick: () => any;
}

const Back: React.FC<Props> = ({ children, className, onClick }) => {
  return (
    <button
      tabIndex={-1}
      style={{ fontSize: `0.665rem` }}
      className={cx(className, `uppercase bold text-gray-500 mb-6 mt-0 block`)}
      onClick={onClick}
    >
      &lsaquo; {children}
    </button>
  );
};

export default Back;
