import React from 'react';
import cx from 'classnames';
import './NavBlock.css';

const NavBlock: React.FC = () => {
  const links: Omit<LinkProps, 'index'>[] = [
    { label: 'Updated editions', bg: 'maroon', block: 'UpdatedEditions' },
    { label: 'Audio Books', bg: 'blue', block: 'AudioBooks' },
    { label: 'Region', bg: 'gold', block: 'Region' },
    { label: 'New Books', bg: 'green', block: 'NewBooks' },
    { label: 'Time Period', bg: 'maroon', block: 'TimePeriod' },
    { label: 'Search', bg: 'blue', block: 'Search' },
  ];
  return (
    <ul className="ExploreNav select-none tracking-wide text-white text-center flex-wrap sm:flex">
      {links.map((props, idx) => (
        <Link key={props.label} index={idx} {...props} />
      ))}
    </ul>
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
  <li
    className={cx(
      `bg-fl${bg} hover:bg-fl${bg}-800 py-6`,
      'sm:w-1/2 sm:bg-flmaroon sm:border-flmaroon-800',
      index % 2 && 'sm:border-l',
      index > 1 && 'sm:border-t',
      `lg:bg-fl${bg} lg:w-1/6 lg:flex-grow lg:border-0`,
    )}
  >
    <a href={`#${block}`}>{label}</a>
  </li>
);
