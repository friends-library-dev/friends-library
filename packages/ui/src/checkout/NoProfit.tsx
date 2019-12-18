import React from 'react';
import cx from 'classnames';

const NoProfit: React.FC<{ className?: string }> = ({ className }) => (
  <p
    className={cx(
      className,
      'text-center font-serif text-md md:text-lg tracking-wide leading-relaxed text-gray-800 antialiased px-4 md:px-6 mb-8',
    )}
  >
    We are committed to never making a profit from the books we make available on this
    website. For that reason, when you order one or more paperback books, we charge you{' '}
    <i>only and exactly</i> what we calculate it will cost us to have the books printed
    and shipped from our printing partner.
  </p>
);

export default NoProfit;
