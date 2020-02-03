import React, { useState } from 'react';
import Switch from 'react-switch';
import cx from 'classnames';
import { AudioQuality } from '@friends-library/types';

interface Props {
  initialQuality: AudioQuality;
  onChange: (quality: AudioQuality) => any;
}

const QualitySwitch: React.FC<Props> = ({ initialQuality, onChange }) => {
  const [quality, setQuality] = useState<AudioQuality>(initialQuality);
  return (
    <Switch
      checked={quality === 'HQ'}
      width={86}
      offColor="#08f"
      onChange={isLq => {
        const newQuality = isLq ? 'HQ' : 'LQ';
        setQuality(newQuality);
        onChange(newQuality);
      }}
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
