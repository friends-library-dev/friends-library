import React from 'react';
import cx from 'classnames';
import './MultiBookBgBlock.css';

interface Props {
  className?: string;
  bright?: boolean;
}

const MultiBookBgBlock: React.FC<Props> = ({ children, className, bright }) => (
  <section
    className={cx(
      className,
      bright && 'MultiBookBgBlock--bright',
      'MultiBookBgBlock py-20 sm:py-32 px-10 sm:px-16 bg-black',
    )}
  >
    {children}
  </section>
);

export default MultiBookBgBlock;
