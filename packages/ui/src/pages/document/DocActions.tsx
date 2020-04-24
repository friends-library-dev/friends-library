import React from 'react';
import { t } from '@friends-library/locale';
import MultiPill from '../../MultiPill';

interface Props {
  price: number;
  paperbackAvailable: boolean;
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
  paperbackAvailable,
  className = '',
}) => {
  return (
    <>
      <MultiPill
        className={className}
        buttons={[
          {
            text: t`Download`,
            icon: 'cloud',
            onClick: download,
          },
          ...(paperbackAvailable
            ? [
                {
                  text: `${t`Paperback`} $${(price / 100).toFixed(2)}`,
                  icon: 'book',
                  onClick: addToCart,
                },
              ]
            : []),
          ...(hasAudio
            ? [{ text: t`Audiobook`, icon: 'headphones', onClick: gotoAudio }]
            : []),
        ]}
      />
      {!paperbackAvailable && (
        <p className="text-center italic text-orange-700 text-base font-serif opacity-75 mb-6 max-w-lg mx-auto">
          <sup>*</sup> For a short period of time this book is not available in paperback
          format, but check back soon&mdash;we&rsquo;re currently working on preparing it
          for print.
        </p>
      )}
    </>
  );
};

export default DocActions;
