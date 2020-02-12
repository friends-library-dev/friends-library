import React from 'react';
import cx from 'classnames';

interface Props {
  dismissable?: boolean;
  onClick: () => any;
}

const FilterPill: React.FC<Props> = ({ children, dismissable }) => {
  return (
    <button
      className={cx(
        'bg-white rounded-full border border-flgray-400 subtle-focus',
        'font-sans text-flgray-500 text-sm tracking-wider antialiased',
        'px-4 py-1 mr-4',
        'hover:bg-flgray-100',
        dismissable && 'pr-2',
      )}
    >
      {children}
      {dismissable && (
        <i
          className="fa fa-times-circle pl-1 text-flprimary text-base font-hairline"
          style={{ transform: 'translateY(2px)' }}
        />
      )}
    </button>
  );
};

export default FilterPill;
