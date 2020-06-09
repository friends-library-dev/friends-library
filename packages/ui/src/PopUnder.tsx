import React from 'react';
import cx from 'classnames';
import './PopUnder.css';

interface Props {
  tailwindBgColor?: string;
  className?: string;
  style?: Record<string, string | number>;
  alignRight?: boolean;
}

const PopUnder: React.FC<Props> = ({
  className,
  children,
  alignRight,
  style,
  tailwindBgColor = `white`,
}) => {
  return (
    <div
      {...(style ? { style } : {})}
      className={cx(
        className,
        `bg-${tailwindBgColor}`,
        `text-${tailwindBgColor}`, // for .PopUnder::after currentColor
        `PopUnder rounded-lg shadow-direct relative`,
        alignRight && `align-right`,
      )}
    >
      {children}
    </div>
  );
};

export default PopUnder;
