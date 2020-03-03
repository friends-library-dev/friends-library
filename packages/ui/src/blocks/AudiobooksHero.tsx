import React from 'react';
import cx from 'classnames';
import './AudiobooksHero.css';

interface Props {
  numBooks: number;
  className?: string;
}

const AudiobooksHero: React.FC<Props> = ({ className, numBooks }) => (
  <div className={cx(className, 'AudiobooksHero text-center')}>
    <h2 className="font-sans text-4xl tracking-wider text-white mb-6">Audio Books</h2>
    <p className="body-text text-white text-lg">
      We currently have {numBooks} titles recorded as audiobooks.
    </p>
  </div>
);

export default AudiobooksHero;
