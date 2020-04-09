import React from 'react';
import Link from 'gatsby-link';
import BackgroundImage from 'gatsby-background-image';
import cx from 'classnames';
import { Lang, FluidBgImageObject } from '@friends-library/types';
import { t } from '@friends-library/ui';
import { LANG } from './env';
import FriendsLogo from './LogoFriends';
import AmigosLogo from './LogoAmigos';
import { bgLayer } from './lib/color';
import './Footer.css';

const Footer: React.FC<{ bgImg: FluidBgImageObject }> = ({ bgImg }) => {
  const Logo = LANG === 'en' ? FriendsLogo : AmigosLogo;
  return (
    <BackgroundImage
      fluid={[bgLayer('flprimary', 0.8), bgImg, bgLayer('flprimary')]}
      id="Footer"
      Tag="footer"
      rootMargin="300px"
      fadeIn={false}
      className="Footer text-gray-300 font-hairline mt-auto"
    >
      <div className="Footer__main">
        <div
          className={cx(
            'text-center flex flex-col items-center px-8 py-12',
            'md:text-left md:flex-row md:items-start md:justify-between',
            LANG === 'es' && 'md:pr-0',
            'lg:p-20',
            'xl:px-40 xl:py-24',
          )}
        >
          <Logo
            iconColor="white"
            friendsColor="white"
            libraryColor="white"
            className={cx('fill-current', 'mb-10 py-2', 'md:mr-4', {
              'w-48': LANG === 'es',
              'w-40': LANG === 'en',
            })}
          />
          <div className="columns flex-grow md:flex md:ml-8 lg:ml-20 max-w-screen-lg">
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
                ['/modernization', 'About modernization', 'en'],
                ['/editions', 'About book editions', 'en'],
                ['/spanish-translations', 'About Spanish translations', 'en'],
                ['/nuestras-traducciones', 'Nuestras Traducciones', 'es'],
                [t`/about`, t`About this Site`],
              ]}
            />
            <LinkList
              last
              title={t`Help`}
              links={[
                [t`/audio-help`, t`Audio Help`],
                [t`/ebook-help`, t`E-Book Help`],
                [t`/contact`, t`Contact Us`],
              ]}
            />
          </div>
        </div>
      </div>

      <p className="bg-gray-900 text-gray-500 p-6 text-center text-xs font-hairline font-serif">
        &copy; {new Date().getFullYear()} {t`Friends Library Publishing`} <b>[,]</b>
      </p>
    </BackgroundImage>
  );
};

export default Footer;

const LinkList: React.FC<{
  title: string;
  links: [string, string, Lang?][];
  last?: boolean;
}> = ({ title, links, last }) => {
  return (
    <dl className={cx(!last && 'mb-10 md:mb-0 md:pr-8', 'md:flex-grow')}>
      <dt className="text-xl font-semibold mb-5 tracking-widest">{title}</dt>
      <dd>
        <ul className="text-gray-300">
          {links
            .filter(([, , lang]) => !lang || lang === LANG)
            .map(([href, text]) => (
              <li
                key={href}
                className="mb-2 tracking-wider leading-tight pb-1 opacity-75 text-md"
              >
                <Link to={href}>{text}</Link>
              </li>
            ))}
        </ul>
      </dd>
    </dl>
  );
};
