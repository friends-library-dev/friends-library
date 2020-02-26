import React from 'react';
import cx from 'classnames';
import './BgWordBlock.css';

interface Props {
  id?: string;
  word: string;
  title?: string;
  className?: string;
}

const BgWordBlock: React.FC<Props> = ({ word, id, className, children, title }) => (
  <div
    {...(id ? { id } : {})}
    className={cx(
      className,
      'BgWordBlock text-center relative overflow-x-hidden font-sans',
    )}
    data-bgword={word}
  >
    {title && <h2 className="text-flgray-900 text-3xl tracking-widest mb-8">{title}</h2>}
    {children}
  </div>
);

export default BgWordBlock;
