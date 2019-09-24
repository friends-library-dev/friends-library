import React from 'react';
import Link from 'gatsby-link';
import './Footer.css';
import FriendsLogo from './LogoFriends';
import AmigosLogo from './LogoAmigos';
import { withTheme } from 'emotion-theming';
import { Theme } from './theme';
import cx from 'classnames';

const Footer: React.FC<{ theme: Theme }> = ({ theme: { lang } }) => {
  const Logo = lang === 'en' ? FriendsLogo : AmigosLogo;
  return (
    <footer className="Footer text-gray-300 font-hairline mt-auto">
      <div className="flex flex-col items-center pt-16 pb-8 py-12 md:pt-16 md:pb-16 lg:py-16 xl:py-24">
        <div className="columns text-center md:flex md:text-left md:pt-2">
          <Logo
            className={cx(
              'fill-current w-48 lg:w-48  md:-mt-12 lg:ml-0 lg:mr-16 xl:-ml-16',
              lang === 'en'
                ? 'mb-16 md:-ml-6 md:mr-8 md:w-32'
                : 'mb-12 h-12 md:h-auto md:mb-16 -mr-6 md:mr-0 mt-4 md:mt-0',
            )}
          />
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
};

export default withTheme(Footer);

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