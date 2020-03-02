import React from 'react';
import cx from 'classnames';

const AudioDuration: React.FC<{ className?: string }> = ({ children, className }) => (
  <div className={cx(className, 'text-sm flex items-center justify-center')}>
    <i className="fa fa-play text-lg mr-2" />
    {children} minutes
  </div>
);

export default AudioDuration;
