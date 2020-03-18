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
      width={106}
      height={36}
      offColor="#5f8c9e"
      onColor="#6c3142"
      onChange={isLq => onChange(isLq ? 'HQ' : 'LQ')}
      uncheckedIcon={<Label className="pl-0 -ml-2">LO-FI</Label>}
      checkedIcon={<Label className="pl-6">HI-FI</Label>}
      aria-label="Audio download quality"
    />
  );
};

export default QualitySwitch;

const Label: React.FC<{ className: string }> = ({ className, children }) => (
  <span
    className={cx(
      className,
      'leading-snug text-white font-sans text-base py-2 w-16 inline-block',
    )}
  >
    {children}
  </span>
);
