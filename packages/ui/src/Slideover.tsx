import React from 'react';
import Link from 'gatsby-link';
import FriendsLogo from './LogoFriends';
import Search from './Search';
import './Slideover.css';

const Slideover: React.FC = () => {
  return (
    <nav className="Slideover bg-flmaroon text-white">
      <header className="p-5 flex border-b-4">
        <span className="w-16 text-2xl pt-2">&#x2715;</span>
        <div className="flex-grow">
          <FriendsLogo className="w-48 mx-auto" />
        </div>
        <i className="w-16" />
      </header>
      <div className="py-12 pl-32">
        <Search className="mb-4" expanded onClick={() => {}} onBlur={() => {}} />
        <LinkGroup
          links={[
            ['/getting-started', 'Getting Started'],
            ['/explore', 'Explore Books'],
            ['/audiobooks', 'Audio Books'],
            ['/friends', 'All Friends'],
          ]}
        />
        <LinkGroup
          links={[
            ['/quakers', 'About the Quakers'],
            ['/modernization', 'About Modernization'],
            ['/editions', 'About Book Editions'],
            ['/about', 'About This Site'],
          ]}
        />
        <LinkGroup
          links={[
            ['/audio-help', 'Audio Help'],
            ['/ebook-help', 'E-Book Help'],
            ['/contact', 'Contact Us'],
            ['#', 'Cart (1)'],
          ]}
        />
      </div>
    </nav>
  );
};

export default Slideover;

const LinkGroup: React.FC<{ links: [string, string][] }> = ({ links }) => (
  <ul className="LinkGroup py-4 text-xl tracking-wider antialiased">
    {links.map(([href, text]) => (
      <li className="py-2">
        <Link to={href}>{text}</Link>
      </li>
    ))}
  </ul>
);
