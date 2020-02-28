import React from 'react';
import Link from 'gatsby-link';
import './GettingStartedLinkBlock.css';

const GettingStartedLinkBlock: React.FC = () => {
  return (
    <div className="GettingStartedLinkBlock p-16 bg-cover sm:p-20 md:p-24">
      <h3 className="text-white text-center font-sans leading-loose tracking-wider text-lg antialiased">
        Looking for just a few hand-picked recommendations? Head on over to our{' '}
        <Link className="fl-underline" to="/getting-started">
          getting started
        </Link>{' '}
        page!
      </h3>
    </div>
  );
};

export default GettingStartedLinkBlock;
