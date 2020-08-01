import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import { LANG } from '../../env';
import { makeScroller } from '../../lib/scroll';
import './NavBlock.css';

const NavBlock: React.FC = () => {
  const enLinks: Omit<LinkProps, 'index'>[] = [
    { label: `Updated Editions`, bg: `maroon`, block: `UpdatedEditionsBlock` },
    { label: `Audio Books`, bg: `blue`, block: `AudioBooksBlock` },
    { label: `Region`, bg: `gold`, block: `RegionBlock` },
    { label: `New Books`, bg: `green`, block: `NewBooksBlock` },
    { label: `Time Period`, bg: `maroon`, block: `TimelineBlock` },
    { label: `Search`, bg: `blue`, block: `SearchBlock` },
  ];
  const esLinks: Omit<LinkProps, 'index'>[] = [
    { label: `Libros`, bg: `maroon`, block: `UpdatedEditionsBlock` },
    { label: t`Audio Books`, bg: `blue`, block: `AudioBooksBlock` },
    { label: `Libros Nuevos`, bg: `green`, block: `NewBooksBlock` },
    { label: t`Search`, bg: `gold`, block: `SearchBlock` },
  ];
  return (
    <div className="ExploreNav select-none tracking-wide text-white text-center flex-wrap sm:flex">
      {(LANG === `en` ? enLinks : esLinks).map((props, idx) => (
        <Link key={props.label} index={idx} {...props} />
      ))}
    </div>
  );
};

export default NavBlock;

interface LinkProps {
  label: string;
  block: string;
  bg: 'maroon' | 'blue' | 'gold' | 'green';
  index: number;
}

const Link: React.FC<LinkProps> = ({ label, index, bg, block }) => (
  <a
    className={cx(
      `block`,
      `bg-fl${bg} hover:bg-fl${bg}-800 py-6`,
      `sm:w-1/2 sm:bg-flmaroon sm:border-flmaroon-800`,
      index % 2 && `sm:border-l`,
      index > 1 && `sm:border-t`,
      `lg:bg-fl${bg} lg:w-1/6 lg:flex-grow lg:border-0`,
    )}
    href={`#${block}`}
    onClick={(e) => {
      e.preventDefault();
      makeScroller(`#${block}`)();
    }}
  >
    {label}
  </a>
);
