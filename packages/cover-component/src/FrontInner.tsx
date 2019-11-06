import React from 'react';
import { CoverProps } from '@friends-library/types';
import { overridable } from './helpers';
import LogoIcon from './LogoIcon';
import FrontMain from './FrontMain';

const FrontInner: React.FC<CoverProps> = props => {
  const { lang, author } = props;
  const fragments = {}; // @TODO
  return (
    <div className="front has-bg">
      <div className="front__safe">
        <div className="top-row">
          <span className="flp">
            {lang === 'es' ? 'Biblioteca de los Amigos' : 'Friends Library Publishing'}
          </span>
          <LogoIcon />
        </div>
        <FrontMain {...props} />
        {overridable(
          'author',
          fragments,
          <div className="author">
            <div className="author__line" />
            <h2 className="author__name">{author}</h2>
          </div>,
        )}
      </div>
    </div>
  );
};

export default FrontInner;
