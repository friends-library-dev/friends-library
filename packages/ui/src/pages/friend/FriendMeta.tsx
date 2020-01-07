import React from 'react';
import cx from 'classnames';
import './FriendMeta.css';

interface Props {
  title: string;
  color: 'green' | 'blue' | 'maroon' | 'gold';
  className?: string;
}

const FriendMeta: React.FC<Props> = ({ children, title, color, className }) => {
  return (
    <aside
      className={cx(className, 'FriendMeta text-white px-6 py-12', {
        'bg-flgreen': color === 'green',
        'bg-flblue': color === 'blue',
        'bg-flmaroon': color === 'maroon',
        'bg-flgold': color === 'gold',
      })}
    >
      <h4 className="text-center font-sans uppercase tracking-wider mb-8">{title}</h4>
      <ul className="body-text text-white ml-6 leading-snug">{children}</ul>
    </aside>
  );
};

export default FriendMeta;
