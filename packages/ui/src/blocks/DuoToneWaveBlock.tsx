import React from 'react';
import cx from 'classnames';
import './DuoToneWaveBlock.css';

const DuoToneWaveBlock: React.FC<{ reverse?: boolean; className?: string }> = ({
  className,
  children,
}) => (
  <section className={cx(className, 'DuoToneWaveBlock overflow-hidden relative')}>
    <Wave colorClass="text-flgreen-600" viewBox="40 60 860 500" />
    <Wave colorClass="text-flgreen-800" viewBox="30 36 840 490" />
    <Wave colorClass="text-flgreen-400" viewBox="200 16 600 500" />
    <Bump colorClass="text-flblue-400" viewBox="80 -250 1200 600" />
    <Bump colorClass="text-flblue-800" viewBox="-0 -280 1010 600" />
    <Bump colorClass="text-flblue-600" viewBox="-30 -330 1020 600" />
    <div className="z-10 relative">{children}</div>
  </section>
);

export default DuoToneWaveBlock;

interface SvgProps {
  colorClass: string;
  viewBox: string;
}

const Wave: React.FC<SvgProps> = ({ colorClass, viewBox }) => (
  <svg className="Wave" viewBox={viewBox} preserveAspectRatio="none">
    <path
      className={cx(colorClass, 'fill-current')}
      d="M 0 460 Q 60 390 170 390 Q 250 390 300 420 Q 400 480 500 470 Q 620 460 670 400 Q 740 320 700 180 Q 670 50 790 0 L 900 0 L 900 600 L 0 600 Z"
    />
  </svg>
);

const Bump: React.FC<SvgProps> = ({ colorClass, viewBox }) => (
  <svg className="Bump" viewBox={viewBox} preserveAspectRatio="none">
    <path
      className={cx(colorClass, 'fill-current')}
      d="M 0 350 Q 180 250 450 230 Q 720 220 800 440 L 800 600 L 0 600 Z"
    />
  </svg>
);
