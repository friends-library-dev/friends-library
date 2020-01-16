import React from 'react';
import MultiPill from '../../MultiPill';

interface Props {
  price: number;
  hasAudio: boolean;
  addToCart: () => void;
  className?: string;
}

const DocActions: React.FC<Props> = ({ price, addToCart, hasAudio, className = '' }) => {
  return (
    <MultiPill
      className={className}
      buttons={[
        { text: 'Download', icon: 'cloud' },
        {
          text: `Paperback $${(price / 100).toFixed(2)}`,
          icon: 'book',
          onClick: addToCart,
        },
        ...(hasAudio ? [{ text: 'Audio Book', icon: 'headphones' }] : []),
      ]}
    />
  );
};

export default DocActions;
