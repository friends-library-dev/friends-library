import React from 'react';
import Button from '../Button';
import { LANG } from '../env';
import './NotFoundHeroBlock.css';

const NotFoundHeroBlock: React.FC = () => (
  <div className="NotFoundHeroBlock text-center text-white px-10 py-20 sm:px-16 sm:py-24 md:py-24 xl:py-32">
    <h1 className="sans-wider text-4xl font-bold">Not Found</h1>
    <p className="body-text text-white py-8 text-lg leading-loose max-w-screen-sm mx-auto">
      Sorry, it looks like you followed a broken link, or tried a URL that doesn't exist.
      try searching below for what you're looking for, or you can contact us if you
      believe you've found a problem with the website &mdash; we'd love to know about so
      we can fix it as soon as possible!
    </p>
    <form
      action="https://google.com/search"
      className="flex flex-col md:flex-row p-3 sm:p-8 max-w-screen-md rounded-md mx-auto"
    >
      <input
        type="hidden"
        name="sitesearch"
        value={LANG === 'en' ? 'friendslibrary.com' : 'bibliotecadelosamigos.org'}
      />
      <input
        className="subtle-focus flex-grow h-12 mb-4 md:mb-0 md:h-auto md:mr-6 rounded-md body-text px-8 text-xl"
        type="text"
        name="q"
        autoFocus
      />
      <Button className="mx-auto">Search</Button>
    </form>
  </div>
);

export default NotFoundHeroBlock;
