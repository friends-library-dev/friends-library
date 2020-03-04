import React from 'react';
import { storiesOf } from '@storybook/react';
import { coverSizes } from './decorators';
import FriendPageHero from '../src/pages/friends/FriendsPageHero';
import CircleSilhouette from '../src/pages/friends/CircleSilhouette';
import CompilationsBlock from '../src/pages/friends/CompilationsBlock';
import FriendCard from '../src/pages/friends/FriendCard';
import Stack from '../src/layout/Stack';

storiesOf('Friends Page', module)
  .addDecorator(coverSizes)
  .add('FriendCard', () => (
    <div>
      <FriendCard
        className=""
        featured
        name="Ann Branson"
        born={1799}
        died={1808}
        region="Leicester, England"
        numBooks={2}
        url="/"
        gender="female"
        bgColor="flgreen"
        fgColor="white"
      />
      <FriendCard
        className=""
        featured
        name="George Fox"
        born={1799}
        died={1808}
        region="Leicester, England"
        numBooks={2}
        url="/"
        gender="male"
        bgColor="flblue"
        fgColor="white"
      />
    </div>
  ))
  .add('FriendCards (multi)', () => (
    <div className="flex bg-flgray-200 p-8">
      <FriendCard
        className="w-1/3 mr-8"
        featured
        name="Ann Branson"
        born={1799}
        died={1808}
        region="Barnseville, Ohio"
        numBooks={2}
        url="/"
        gender="female"
        bgColor="flgreen"
        fgColor="white"
      />
      <FriendCard
        className="w-1/3 mr-8"
        name="Ann Branson"
        born={1799}
        died={1808}
        region="Barnseville, Ohio"
        numBooks={2}
        url="/"
        gender="female"
        bgColor="flgreen"
        fgColor="white"
      />
      <FriendCard
        className="w-1/3"
        featured
        name="George Fox"
        born={1799}
        died={1808}
        region="Leicester, England"
        numBooks={2}
        url="/"
        gender="male"
        bgColor="flblue"
        fgColor="white"
      />
    </div>
  ))
  .add('CircleSilhouettes', () => (
    <Stack space={'6'} className="p-8 bg-gray-400">
      <CircleSilhouette bgColor="white" gender="male" fgColor="flgreen" />
      <CircleSilhouette bgColor="flgreen" gender="male" fgColor="white" />
      <CircleSilhouette bgColor="white" gender="female" fgColor="flgreen" />
      <CircleSilhouette bgColor="flgreen" gender="female" fgColor="white" />
    </Stack>
  ))
  .add('CompilationsBlock', () => <CompilationsBlock />)
  .add('FriendPageHero', () => <FriendPageHero numFriends={89} />);
