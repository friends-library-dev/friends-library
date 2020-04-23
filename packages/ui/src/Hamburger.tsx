import React from 'react';
import cx from 'classnames';
import './Hamburger.css';

interface Props {
  onClick: () => any;
  className?: string;
}

const Component: React.FC<Props> = ({ onClick, className }) => (
  <div
    className={cx(className, 'Hamburger flex flex-col justify-center bg-flprimary')}
    onClick={onClick}
  >
    <div />
    <div />
    <div />
  </div>
);

export default Component;
