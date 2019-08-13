import React from 'react';
import Link from 'gatsby-link';
import './Footer.css';
import FriendsLogo from './LogoFriends';

const Footer: React.FC = () => (
  <footer className="Footer text-gray-300 font-hairline">
    <div className="flex flex-col items-center pt-16 pb-8 py-12 md:pt-16 md:pb-16 lg:py-16 xl:py-24">
      <div className="columns text-center md:flex md:text-left md:pt-2">
        <FriendsLogo className="fill-current w-48 md:w-32 lg:w-48 mb-16 md:-mt-12 md:-ml-6 md:mr-8 lg:ml-0 lg:mr-16 xl:-ml-16" />
        <LinkList
          title="Books"
          links={[
            ['/getting-started', 'Getting Started'],
            ['/explore', 'Explore books'],
            ['/audiobooks', 'Audiobooks'],
            ['/friends', 'All Friends'],
          ]}
        />
        <LinkList
          title="About"
          links={[
            ['/quakers', 'About the Quakers'],
            ['/modernization', 'About modernization'],
            ['/editions', 'About book editions'],
            ['/about', 'About this site'],
          ]}
        />
        <LinkList
          title="Help"
          links={[
            ['/audio-help', 'Audio help'],
            ['/ebook-helpo', 'E-book help'],
            ['/contact', 'Contact us'],
          ]}
        />
      </div>
    </div>

    <p className="bg-gray-900 text-gray-500 p-6 text-center text-xs font-hairline font-serif">
      &copy; {new Date().getFullYear()} Friends Library Publishing <b>[,]</b>
    </p>
  </footer>
);

export default Footer;
const LinkList: React.FC<{ title: string; links: [string, string][] }> = ({
  title,
  links,
}) => {
  return (
    <dl className="flex-grow mb-12 md:mb-0 md:ml-12 lg:ml-24 xl:ml-32">
      <dt className="text-xl font-semibold mb-5 tracking-widest">{title}</dt>
      <dd>
        <ul className="text-gray-300">
          {links.map(([href, text]) => (
            <li className="mb-2 tracking-wider opacity-75 text-md">
              <Link to={href}>{text}</Link>
            </li>
          ))}
        </ul>
      </dd>
    </dl>
  );
};
