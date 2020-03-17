import React from 'react';
import cx from 'classnames';
import './WaveBottomBlock.css';

interface Props {
  color: 'blue' | 'maroon' | 'green' | 'gold';
  className?: string;
  id?: string;
}

const WaveBottomBlock: React.FC<Props> = ({ id, color, children, className }) => {
  return (
    <section
      id={id}
      className={cx(className, `WaveBottomBlock WaveBottomBlock--${color}`)}
    >
      {children}
    </section>
  );
};

export default WaveBottomBlock;
