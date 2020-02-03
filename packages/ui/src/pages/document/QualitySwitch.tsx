import React from 'react';
import Switch from 'react-switch';
import cx from 'classnames';
import { AudioQuality } from '@friends-library/types';

interface Props {
  quality: AudioQuality;
  onChange: (quality: AudioQuality) => any;
  className?: string;
}

const QualitySwitch: React.FC<Props> = ({ className, quality, onChange }) => {
  return (
    <Switch
      className={className}
      checked={quality === 'HQ'}
      width={86}
      offColor="#5f8c9e"
      onChange={isLq => onChange(isLq ? 'HQ' : 'LQ')}
      uncheckedIcon={<Label className="pl-0 -ml-2">LO-FI</Label>}
      checkedIcon={<Label className="pl-4">HI-FI</Label>}
      aria-label="Audio download quality"
    />
  );
};

export default QualitySwitch;

const Label: React.FC<{ className: string }> = ({ className, children }) => (
  <span
    className={cx(
      className,
      'leading-snug text-white font-sans text-base py-1 w-16 inline-block',
    )}
  >
    {children}
  </span>
);
