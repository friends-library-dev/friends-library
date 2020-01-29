import React from 'react';
import MultiPill from '../../MultiPill';

interface Props {
  price: number;
  hasAudio: boolean;
  addToCart: () => void;
  download: () => any;
  gotoAudio: () => any;
  className?: string;
}

const DocActions: React.FC<Props> = ({
  price,
  addToCart,
  hasAudio,
  download,
  gotoAudio,
  className = '',
}) => {
  return (
    <MultiPill
      className={className}
      buttons={[
        {
          text: 'Download',
          icon: 'cloud',
          onClick: download,
        },
        {
          text: `Paperback $${(price / 100).toFixed(2)}`,
          icon: 'book',
          onClick: addToCart,
        },
        ...(hasAudio
          ? [{ text: 'Audio Book', icon: 'headphones', onClick: gotoAudio }]
          : []),
      ]}
    />
  );
};

export default DocActions;
