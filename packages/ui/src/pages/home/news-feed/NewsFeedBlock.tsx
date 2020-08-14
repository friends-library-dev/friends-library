import React from 'react';
import BackgroundImage from 'gatsby-background-image';
import { FluidBgImageObject } from '@friends-library/types';
import Dual from '../../../Dual';
import { bgLayer } from '../../../lib/color';
import NewsFeed from './NewsFeed';

interface Props {
  items: React.ComponentProps<typeof NewsFeed>['items'];
  bgImg: FluidBgImageObject;
}

const NewsFeedBlock: React.FC<Props> = ({ bgImg, items }) => {
  return (
    <BackgroundImage
      id="NewsFeedBlock"
      as="section"
      className="pt-8 pb-6 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center"
      fluid={[bgLayer([0, 0, 0], 0.8), bgImg, bgLayer(`black`)]}
    >
      <Dual.H1 className="sans-widest text-3xl font-bold mb-6 antialiased text-white text-center px-6">
        <>What&rsquo;s New</>
        <>Añadidos Recientemente</>
      </Dual.H1>
      <div className="flex self-stretch justify-center">
        <NewsFeed className="max-w-screen-lg flex-grow self-stretch" items={items} />
      </div>
    </BackgroundImage>
  );
};

export default NewsFeedBlock;
