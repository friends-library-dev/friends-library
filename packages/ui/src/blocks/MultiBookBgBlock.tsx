import React from 'react';
import cx from 'classnames';
import './MultiBookBgBlock.css';

const MultiBookBgBlock: React.FC<{ className?: string }> = ({ children, className }) => (
  <section
    className={cx(className, 'MultiBookBgBlock py-20 sm:py-32 px-8 sm:px-16 bg-black')}
  >
    {children}
  </section>
);

export default MultiBookBgBlock;
