import React from 'react';
import cx from 'classnames';

interface Props {
  className?: string;
  dismissable?: boolean;
  onClick: () => any;
}

const FilterBtn: React.FC<Props> = ({ children, dismissable, className, onClick }) => (
  <button
    onClick={onClick}
    className={cx(
      className,
      'bg-white rounded-full border border-flgray-400 subtle-focus h-8',
      'font-sans text-flgray-500 whitespace-no-wrap text-sm tracking-wider antialiased',
      'px-4 py-1 select-none',
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

export default FilterBtn;
