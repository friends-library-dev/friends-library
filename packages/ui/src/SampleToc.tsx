import React from 'react';
import cx from 'classnames';
import { Heading } from '@friends-library/types';
import './SampleToc.css';

interface Props {
  onClose: () => void;
  chapters: Omit<Heading, 'id'>[];
  className?: string;
}

const SampleToc: React.FC<Props> = ({ chapters, onClose, className = '' }) => {
  return (
    <div
      className={cx(
        className,
        'SampleToc p-8 px-16 pb-8 bg-white border-flprimary relative',
      )}
    >
      <h5 className="font-sans uppercase text-center text-xl tracking-wider mb-6">
        Table of Contents
      </h5>
      <ul className="font-serif">
        {chapters.map(chapter => (
          <Chapter {...chapter} />
        ))}
      </ul>
      <button className="absolute font-bold" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default SampleToc;

const Chapter: React.FC<Omit<Heading, 'id'>> = ({ text, shortText, sequence }) => {
  return (
    <h6 className="leading-loose">
      {sequence && (
        <b className="antialiased pr-2">
          {sequence.type} {sequence.number}:
        </b>
      )}
      {shortText || text}
    </h6>
  );
};
