import React from 'react';
import cx from 'classnames';

interface Props {
  tailwindColor?: string;
  className?: string;
}

const PlayTriangle: React.FC<Props> = ({ tailwindColor = `flprimary`, className }) => (
  <svg
    className={cx(className, `inline-block`)}
    viewBox="0 0 66 102"
    width="66"
    height="102"
  >
    <polygon
      className={cx(`text-${tailwindColor}`, `stroke-current`)}
      strokeWidth="9"
      strokeLinejoin="round"
      fill="transparent"
      points="5, 5 60, 50 5, 95"
    />
  </svg>
);

export default PlayTriangle;
