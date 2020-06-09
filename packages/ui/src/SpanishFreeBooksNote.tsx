import React from 'react';
import cx from 'classnames';
import { LANG } from './env';

const SpanishFreeBooksNote: React.FC<{ className?: string }> = ({ className }) => {
  if (LANG === `en`) return null;
  return (
    <p className={cx(className, `text-center italic`)}>
      Si debido a limitaciones financieras, no puedes comprar nuestros libros por el costo
      de la impresión más el envío, puedes solicitarlos gratuitamente rellenando el
      formulario al final de{` `}
      <a
        href="https://www.zoecostarica.com/libros/#request"
        target="_blank"
        rel="noopener noreferrer"
        className="subtle-link"
      >
        esta página
      </a>
      .
    </p>
  );
};

export default SpanishFreeBooksNote;
