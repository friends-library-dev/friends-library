import React from 'react';
import Link from 'gatsby-link';
import cx from 'classnames';
import { Lang } from '@friends-library/types';
import { t } from '@friends-library/ui';
import { LANG } from './env';
import FriendsLogo from './LogoFriends';
import AmigosLogo from './LogoAmigos';
import './Footer.css';

const Footer: React.FC = () => {
  const Logo = LANG === 'en' ? FriendsLogo : AmigosLogo;
  return (
    <footer className="Footer text-gray-300 font-hairline mt-auto">
      <div className="flex flex-col items-center pt-16 pb-8 py-12 md:pt-16 md:pb-16 lg:py-16 xl:py-24">
        <div className="columns text-center md:flex md:text-left md:pt-2">
          <Logo
            iconColor="white"
            friendsColor="white"
            libraryColor="white"
            className={cx(
              'fill-current w-48 lg:w-48  md:-mt-12 lg:ml-0 lg:mr-16 xl:-ml-16',
              LANG === 'en'
                ? 'mb-16 md:-ml-6 md:mr-8 md:w-32'
                : 'mb-12 h-12 md:h-auto md:mb-16 -mr-6 md:mr-0 mt-4 md:mt-0',
            )}
          />
          <LinkList
            title={t`Books`}
            links={[
              [t`/getting-started`, t`Getting Started`],
              [t`/explore`, t`Explore Books`],
              [t`/audiobooks`, t`Audiobooks`],
              [t`/friends`, t`All Friends`],
            ]}
          />
          <LinkList
            title={t`About`}
            links={[
              [t`/quakers`, t`About the Quakers`],
              [t`/modernization`, t`About modernization`, 'en'],
              [t`/editions`, t`About book editions`, 'en'],
              ['/spanish-translations', 'About Spanish translations', 'en'],
              ['/nuestras-traducciones', 'Nuestras Traducciones', 'es'],
              [t`/about`, t`About this Site`],
            ]}
          />
          <LinkList
            title={t`Help`}
            links={[
              [t`/audio-help`, t`Audio Help`],
              [t`/ebook-help`, t`E-book Help`],
              [t`/contact`, t`Contact Us`],
            ]}
          />
        </div>
      </div>

      <p className="bg-gray-900 text-gray-500 p-6 text-center text-xs font-hairline font-serif">
        &copy; {new Date().getFullYear()} {t`Friends Library Publishing`} <b>[,]</b>
      </p>
    </footer>
  );
};

export default Footer;

const LinkList: React.FC<{
  title: string;
  links: [string, string, Lang?][];
}> = ({ title, links }) => {
  return (
    <dl className="flex-grow mb-12 md:mb-0 md:ml-12 lg:ml-24 xl:ml-32">
      <dt className="text-xl font-semibold mb-5 tracking-widest">{title}</dt>
      <dd>
        <ul className="text-gray-300">
          {links
            .filter(([, , lang]) => !lang || lang === LANG)
            .map(([href, text]) => (
              <li key={href} className="mb-2 tracking-wider opacity-75 text-md">
                <Link to={href}>{text}</Link>
              </li>
            ))}
        </ul>
      </dd>
    </dl>
  );
};
