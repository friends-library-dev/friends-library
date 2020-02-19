import React from 'react';
import cx from 'classnames';

const PillDropdownItem: React.FC<{
  selected?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => any;
}> = ({ children, className, selected, onClick }) => (
  <div
    onClick={onClick}
    className={cx(
      className,
      'PillDropdownItem p-3 select-none',
      'font-sans tracking-wide text-flgray-500 text-center cursor-pointer',
      selected && 'bg-flgray-300 hover:bg-flgray-400',
      selected === false && 'bg-white hover:bg-gray-200',
      selected !== undefined && 'hover:text-flgray-500',
    )}
  >
    {children}
  </div>
);

export default PillDropdownItem;
