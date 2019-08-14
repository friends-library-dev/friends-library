import React from 'react';
import cx from 'classnames';
import './Heading.css';

type Screen = 'sm' | 'md' | 'lg' | 'xl';

const Heading: React.FC<{
  className?: string;
  darkBg?: boolean;
  left?: true | Screen[];
}> = ({ children, className, darkBg, left }) => (
  <h1
    className={cx(
      className,
      'Heading font-sans uppercase text-center text-2xl mb-5 text-3xl tracking-wider font-black',
      {
        'Heading--darkbg': darkBg,
        'Heading--left': left === true,
        'Heading--sm-left': Array.isArray(left) && left.includes('sm'),
        'Heading--md-left': Array.isArray(left) && left.includes('md'),
        'Heading--lg-left': Array.isArray(left) && left.includes('lg'),
        'Heading--xl-left': Array.isArray(left) && left.includes('xl'),
      },
    )}
  >
    {children}
  </h1>
);

export default Heading;
