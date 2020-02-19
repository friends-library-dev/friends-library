import React, { useState } from 'react';
import cx from 'classnames';

interface Props {
  pillText: string;
  className?: string;
}

const PillDropdown: React.FC<Props> = ({ className, pillText, children }) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(true);
  return (
    <div
      className={cx(className, 'rounded-full w-64 bg-white relative h-12 cursor-pointer')}
    >
      <div
        onClick={() => setDropdownVisible(!dropdownVisible)}
        className={cx(
          'border border-flgray-400 rounded-full subtle-focus',
          'h-12 w-64 pt-3 text-center select-none',
          'text-flgray-500 antialiased font-sans tracking-widest',
        )}
      >
        {pillText}
      </div>
      <div className="h-12 w-12 absolute top-0 right-0 flex justify-center items-center">
        <i
          className={`fa fa-chevron-${dropdownVisible ? 'up' : 'down'} text-flgray-400`}
        />
      </div>
      {dropdownVisible && children}
    </div>
  );
};

export default PillDropdown;
