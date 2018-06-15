// @flow
import * as React from 'react';
import HeroBlock from './HeroBlock';
import TempBlock from './TempBlock';

export default () => (
  <div>
    <HeroBlock />
    <TempBlock
      title="Featured Books"
      bgColor="#ccc"
    />
    <TempBlock
      title="Getting Started"
    />
    <TempBlock
      title="About Quakers"
      bgColor="salmon"
    />
    <TempBlock
      title="Asset Explanation"
      fontColor="#fff"
      bgColor="green"
    />
    <TempBlock
      title="Explore Documents"
      bgColor="yellow"
    />
    <TempBlock
      title="Footer"
      fontColor="#fff"
      bgColor="#000"
    />
  </div>
);
