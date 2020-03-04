import React from 'react';
import cx from 'classnames';
import { Male, Female } from '../friend/Silhouettes';

interface Props {
  className?: string;
  gender: 'male' | 'female';
  bgColor: string;
  fgColor: string;
}

const CircleSilhouette: React.FC<Props> = ({ gender, bgColor, fgColor, className }) => {
  const Silhouette = gender === 'male' ? Male : Female;
  const size = 180;
  const shrinker = 0.83;
  const height = gender === 'male' ? size * 0.89 * shrinker : size * 0.9 * shrinker;
  const xOffset = gender === 'male' ? size * 0 : size * 0;
  const yOffset = gender === 'male' ? size * 0 : size * -0.015;
  return (
    <div
      className={cx(
        className,
        `CircleSilhouette CircleSilhouette--${gender} bg-${bgColor}`,
        'rounded-full flex items-center justify-center',
        `border-8 border-${fgColor}`,
      )}
      style={{ width: size, height: size }}
    >
      <Silhouette
        tailwindColor={fgColor}
        height={height}
        style={{ transform: `translateX(-${xOffset}px) translateY(${yOffset}px)` }}
      />
    </div>
  );
};

export default CircleSilhouette;
