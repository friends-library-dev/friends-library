import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';

interface Props {
  pillText: string;
  className?: string;
  autoHide?: boolean;
}

const PillDropdown: React.FC<Props> = ({
  className,
  pillText,
  children,
  autoHide = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  useEffect(() => {
    const click: (event: any) => any = event => {
      if (
        ref.current &&
        (!ref.current.contains(event.target) || (autoHide && dropdownVisible))
      ) {
        setDropdownVisible(false);
      }
    };

    const escape: (e: KeyboardEvent) => any = ({ keyCode }) => {
      keyCode === 27 && setDropdownVisible(false);
    };

    document.addEventListener('click', click);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('click', click);
      window.removeEventListener('keydown', escape);
    };
  }, [dropdownVisible, autoHide]);

  return (
    <div
      ref={ref}
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
      <div
        onClick={() => setDropdownVisible(!dropdownVisible)}
        className="h-12 w-12 absolute top-0 right-0 flex justify-center items-center"
      >
        <i
          className={`fa fa-chevron-${dropdownVisible ? 'up' : 'down'} text-flgray-400`}
        />
      </div>
      {dropdownVisible && children}
    </div>
  );
};

export default PillDropdown;
