import React from 'react';
import cx from 'classnames';
import { Dual } from '../translation';
import SpanishFreeBooksNote from '../SpanishFreeBooksNote';

const NoProfit: React.FC<{ className?: string }> = ({ className }) => (
  <>
    <Dual.p
      className={cx(
        className,
        'text-center font-serif text-md md:text-lg tracking-wide leading-relaxed text-gray-800 antialiased px-4 md:px-6 mb-8',
      )}
    >
      <>
        We are committed to never making a profit from the books on this website. For that
        reason, when you order one or more paperbacks, we charge you{' '}
        <i>only and exactly</i> what we calculate it will cost us to have the books
        printed and shipped from our printing partner.
      </>
      <>
        Estamos comprometidos a nunca obtener ganancias por los libros en nuestro sitio
        web. Por esa razón, cuando pides uno o más libros impresos, sólo cobramos lo que
        calculamos que nos costará exactamente imprimir y enviar los libros a través de la
        imprenta que nos presta este servicio.
      </>
    </Dual.p>
    <SpanishFreeBooksNote className="font-serif text-sm md:text-lg tracking-wide leading-relaxed text-gray-800 antialiased px-4 md:px-6 mb-8" />
  </>
);

export default NoProfit;
