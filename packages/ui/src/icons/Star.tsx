import React from 'react';
import cx from 'classnames';

interface Props {
  tailwindColor?: string;
  className?: string;
  height?: number;
}

const StarIcon: React.FC<Props> = ({
  tailwindColor = `white`,
  className,
  height = 40,
}) => {
  return (
    <svg
      className={cx(className, `inline-block`)}
      width={height}
      height={height}
      viewBox="0 0 40 40"
    >
      <path
        className={cx(`text-${tailwindColor}`, `fill-current`)}
        d="M27.5692925,30.4 L20.4000793,26.5733291 L13.230866,30.4 L14.5994716,22.2952151 L8.8,16.5562817 L16.8155255,15.3733023 L20.4,8 L23.9844745,15.3733023 L32,16.5562817 L26.1994716,22.2960198 L27.5692925,30.4 Z M11.1656845,17.336047 L15.7835424,21.9043936 L14.6936149,28.3568378 L20.4003435,25.3110051 L26.108129,28.3568378 L25.0182014,21.9043936 L29.6360594,17.336047 L23.2555574,16.3951248 L20.4006077,10.5252916 L17.546715,16.3951248 L11.1656845,17.336047 Z"
      />
    </svg>
  );
};

export default StarIcon;
