import React from 'react';
import Link from 'gatsby-link';
import AmigosLogo from '../../LogoAmigos';
import './SpanishSiteBlock.css';

const SpanishSiteBlock: React.FC<{ numBooks: number; url: string }> = ({
  numBooks,
  url,
}) => (
  <div className="SpanishSiteBlock p-16 bg-flgold text-white font-sans text-lg antialiased tracking-wide text-center leading-loose relative overflow-hidden">
    <AmigosLogo
      className="absolute"
      libraryColor="white"
      iconColor="white"
      friendsColor="white"
    />
    <h3 className="relative z-50">
      We also have {numBooks} books{' '}
      <Link to="/spanish-translations" className="subtle-link text-white">
        translated
      </Link>{' '}
      into Spanish! Switch to our{' '}
      <a className="fl-underline" href={url}>
        Spanish site here.
      </a>
    </h3>
  </div>
);

export default SpanishSiteBlock;
