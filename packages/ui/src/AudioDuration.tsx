import React from 'react';
import cx from 'classnames';
import PlayTriangle from './icons/PlayTriangle';

interface Props {
  textColor?: string;
  className?: string;
}

const AudioDuration: React.FC<Props> = ({
  children,
  textColor = 'flprimary',
  className,
}) => (
  <div
    className={cx(
      className,
      `text-${textColor}`,
      'text-sm flex items-center justify-center',
    )}
  >
    <PlayTriangle className="h-5 w-5 mr-1" tailwindColor={textColor} />
    {children} minutes
  </div>
);

export default AudioDuration;
