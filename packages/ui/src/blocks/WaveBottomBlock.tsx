import React from 'react';
import cx from 'classnames';

interface Props {
  color: 'blue' | 'maroon' | 'green' | 'gold';
  className?: string;
  id?: string;
}

const WaveBottomBlock: React.FC<Props> = ({ id, color, children, className }) => {
  return (
    <section id={id} className={cx(className, 'overflow-hidden relative')}>
      <Bump colorClass={`text-fl${color}-400`} viewBox="100 -180 1200 600" />
      <Bump colorClass={`text-fl${color}-800`} viewBox="-0 -180 1010 600" />
      <Bump colorClass={`text-fl${color}-600`} viewBox="300 -245 1020 600" />
      <div className="z-10 relative">{children}</div>
    </section>
  );
};

export default WaveBottomBlock;

const Bump: React.FC<{ colorClass: string; viewBox: string }> = ({
  colorClass,
  viewBox,
}) => (
  <svg
    className="absolute bottom-0"
    style={{ height: '60vh', width: '3000px', left: '-60%' }}
    viewBox={viewBox}
    preserveAspectRatio="none"
  >
    <path
      className={`${colorClass} fill-current`}
      d="M 30 300 Q 120 210 210 270 Q 315 330 420 240 Q 510 180 615 270 C 750 390 840 210 930 315 C 1005 405 1140 285 1200 255 L 1200 600 L 15 600 Z"
    />
  </svg>
);
