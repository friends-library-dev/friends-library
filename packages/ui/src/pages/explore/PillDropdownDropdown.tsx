import React from 'react';
import { Accordion } from '@reach/accordion';
import cx from 'classnames';
import './PillDropdownDropdown.css';

interface Props {
  className?: string;
  accordion?: boolean;
}

const PillDropdownDropdown: React.FC<Props> = ({ className, accordion, children }) => {
  const Element = accordion ? Accordion : 'div';
  return (
    <Element
      className={cx(
        className,
        'PillDropdownDropdown relative rounded-lg bg-flgray-100 shadow-direct',
        'mt-3 w-64 py-4 z-10',
        'text-flgray-100 antialiased',
      )}
    >
      {children}
    </Element>
  );
};

export default PillDropdownDropdown;
